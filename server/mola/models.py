from django.db import models

class Sunfish(models.Model):
    name = models.CharField(max_length=100, default="Mola")
    level = models.IntegerField(default=1)
    is_alive = models.BooleanField(default=True)
    creation_date = models.DateTimeField(auto_now_add=True)

class Contribution(models.Model):
    sunfish = models.ForeignKey(Sunfish, on_delete=models.CASCADE, related_name="contributions")
    date = models.DateField()
    count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.sunfish.name} - {self.date}: {self.count} contributions"
