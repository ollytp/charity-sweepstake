from django.urls import path
from .views import GuessView

urlpatterns = [
    path('submit-guess/', GuessView.as_view(), name='submit-guess'),
]
