import numpy as np
import cv2
from matplotlib import pyplot as plt

img1 = cv2.imread('test.png', 0)  # queryImage
img2 = cv2.imread('logos/nike.png', 0)  # trainImage

# Initiate SIFT detector
sift = cv2.xfeatures2d.SIFT_create()

cap = cv2.VideoCapture(0)

while True:
    # find the keypoints and descriptors with SIFT
    kp1, des1 = sift.detectAndCompute(img1, None)
    kp2, des2 = sift.detectAndCompute(img2, None)

    # BFMatcher with default params
    bf = cv2.BFMatcher()
    matches = bf.knnMatch(des1, des2, k=2)

    # Apply ratio test
    good = []
    for m, n in matches:
        if m.distance < 0.75 * n.distance:
            good.append([m])

    # cv2.drawMatchesKnn expects list of lists as matches.

    img3 = cv2.drawMatchesKnn(img1, kp1, img2, kp2, good, None, flags=2)

    plt.imshow(img3), plt.show()
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()
