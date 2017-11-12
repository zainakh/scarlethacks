# Sifter

This project utilizes openCV to continually scan the input frames of a camera to search for logos. It then performs a matching template function with images of the logos from companies we have chosen and the camera's frames. This accounts for scaling and rotation of the image based on the SIFT and SURF matching functions that are available in openCV. 

After finding a logo with a high enough confidence score (based on how well the interpreted logo matches the real one), web scraping is done to find coupons for that company that are currently available.

The coupon deals are displayed in virtual reality through the Oculus Rift.
