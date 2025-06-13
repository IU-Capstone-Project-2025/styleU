import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
import joblib

# 1. Загрузка данных
df = pd.read_csv("body_shapes_dataset.csv")
X = df[["bust", "waist", "hips", "height"]]
y = df["body_type"]

# 2. Обучение
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
clf = DecisionTreeClassifier()
clf.fit(X_train, y_train)

# 3. Сохранение модели
joblib.dump(clf, "ml-service/model/body_model.joblib")
print("✓ Модель сохранена в ml-service/model/body_model.joblib")

model = joblib.load("ml-service/model/body_model.joblib")
sample = [[90, 65, 95, 165]]
print("Предсказание:", model.predict(sample))
