from django.shortcuts import render

# Create your views here.

import square
from square.client import Client
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, Guess
from .serializers import UserSerializer, GuessSerializer


class GuessView(APIView):
    def post(self, request):
        # Register user
        user_serializer = UserSerializer(data=request.data['user'])
        if user_serializer.is_valid():
            user = user_serializer.save()

            # Save the guess and donation
            guess_data = {
                'user': user.id,
                'guess': request.data['guess'],
                'donation': request.data.get('donation', 0.00)
            }
            guess_serializer = GuessSerializer(data=guess_data)
            if guess_serializer.is_valid():
                guess_serializer.save()

                # Square payment processing
                square_client = Client(access_token='YOUR_SQUARE_ACCESS_TOKEN',
                                       environment='sandbox')  # Replace with 'production' for live
                try:
                    payment_result = square_client.payments.create_payment({
                        "source_id": request.data['payment_nonce'],  # Nonce from frontend
                        "amount_money": {
                            "amount": 250,  # £2.50 in pennies
                            "currency": "GBP"
                        },
                        "idempotency_key": "UNIQUE_IDEMPOTENCY_KEY"
                    })
                    if payment_result.is_success():
                        guess = Guess.objects.get(id=guess_serializer.data['id'])
                        guess.paid = True
                        guess.save()
                        return Response({'message': 'Payment and guess submitted successfully!'},
                                        status=status.HTTP_201_CREATED)
                    else:
                        return Response({'error': 'Payment failed!'}, status=status.HTTP_400_BAD_REQUEST)
                except square.exceptions.ApiError as e:
                    return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
