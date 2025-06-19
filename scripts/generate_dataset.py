import pandas as pd
import random

def generate_sample():
    body_types = ["песочные часы", "груша", "яблоко", "прямоугольник", "перевёрнутый треугольник"]
    data = []

    for _ in range(1000):
        height = random.uniform(150, 180)

        t = random.choice(body_types)

        if t == "песочные часы":
            bust = random.uniform(85, 100)
            hips = bust + random.uniform(-3, 3)
            waist = bust - 15
        elif t == "груша":
            hips = random.uniform(95, 110)
            bust = hips - random.uniform(10, 20)
            waist = bust - 10
        elif t == "яблоко":
            waist = random.uniform(90, 100)
            bust = waist + random.uniform(-5, 5)
            hips = bust - random.uniform(5, 10)
        elif t == "прямоугольник":
            bust = random.uniform(80, 95)
            waist = bust - random.uniform(2, 5)
            hips = bust + random.uniform(-3, 3)
        elif t == "перевёрнутый треугольник":
            bust = random.uniform(95, 110)
            hips = bust - random.uniform(10, 15)
            waist = hips - 10

        data.append([bust, waist, hips, height, t])

    df = pd.DataFrame(data, columns=["bust", "waist", "hips", "height", "body_type"])
    df.to_csv("body_shapes_dataset.csv", index=False)
    print("✓ Сохранено в body_shapes_dataset.csv")

if __name__ == "__main__":
    generate_sample()
