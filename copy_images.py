import shutil
import os

images = {
    "goguide.png": "proj_goguide_1773265155698.png",
    "expense.png": "belezerio_dashboard_1773265333789.png",
    "smartmart.png": "proj_smartmart_1773265172388.png",
    "talks.png": "belezerio_pythonanywhere_1773265409097.png",
    "sentiment.png": "proj_sentiment_1773265243269.png",
    "snake.png": "proj_snake_1773265261394.png"
}

source_dir = "/home/endeavour/.gemini/antigravity/brain/9efdd146-5155-4915-aee0-ba51b182b31c"
dest_dir = "images"

if not os.path.exists(dest_dir):
    os.makedirs(dest_dir)

for dest, src in images.items():
    shutil.copy(os.path.join(source_dir, src), os.path.join(dest_dir, dest))
