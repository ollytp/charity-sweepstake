from rest_framework import serializers
from .models import User, Guess

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class GuessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guess
        fields = '__all__'
