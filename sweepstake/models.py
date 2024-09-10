from django.db import models

# Create your models here.
from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()
    consent = models.BooleanField(default=False)

class Guess(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    guess = models.IntegerField(unique=True)  # Ensure no duplicate guesses
    created_at = models.DateTimeField(auto_now_add=True)
    paid = models.BooleanField(default=False)  # Only mark if the user has paid
    donation = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)  # Extra donation amount
