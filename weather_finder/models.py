from django.db import models
from django.template.defaultfilters import slugify

class City(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    created_on = models.DateTimeField(auto_now_add=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    latitutde = models.DecimalField(max_digits=9, decimal_places=6)


    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super(City, self).save(*args, **kwargs)

    class Meta:
        ordering = ['created_on']

        def __unicode__(self):
            return self.title