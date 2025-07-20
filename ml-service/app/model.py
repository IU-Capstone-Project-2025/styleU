def predict_body_type(features: list[float]) -> str:
    """
    features: [bust (shoulders for men), waist, hips, height, sex]
    Returns: body shape string (на русском)
    """
    bust, waist, hips, height, sex = features

    bust_hips_diff = bust - hips
    hips_bust_diff = hips - bust
    bust_waist_diff = bust - waist
    hips_waist_diff = hips - waist

    # 👩 Женские типы
    if sex.lower() == "female":
        # Песочные часы
        if (
            abs(bust_hips_diff) <= 1
            and (bust_waist_diff >= 11 or hips_waist_diff >= 11)
        ):
            return "Песочные часы"

        # Песочные часы с акцентом
        if (
            3.6 <= hips_bust_diff < 10 and hips_waist_diff >= 11
        ) or (
            1 < bust_hips_diff < 10 and bust_waist_diff >= 11
        ):
            return "Песочные часы"

        # Груша
        if hips_bust_diff > 2 and hips_waist_diff >= 7:
            return "Груша"

        # Перевёрнутый треугольник
        if bust_hips_diff >= 5 and hips_waist_diff < 11 and bust_waist_diff >= 5:
            return "Перевёрнутый треугольник"

        # Яблоко
        if bust_hips_diff >= 3.6 and waist >= hips:
            return "Яблоко"

        # Прямоугольник
        if abs(bust_hips_diff) < 3.6 and bust_waist_diff < 11 and hips_waist_diff < 11:
            return "Прямоугольник"

    # 👨 Мужские типы
    elif sex.lower() == "male":
        shoulder_hip_diff = bust - hips
        shoulder_waist_diff = bust - waist
        waist_hip_diff = waist - hips

        # Перевёрнутый треугольник: очень широкие плечи, узкие талия и бёдра
        if shoulder_waist_diff >= 10 and shoulder_hip_diff >= 10:
            return "Перевёрнутый треугольник"

        # Трапеция: плечи шире бёдер, но талия не сильно узкая
        if shoulder_hip_diff >= 5 and shoulder_waist_diff >= 5:
            return "Трапеция"

        # Прямоугольник: плечи ≈ талия ≈ бёдра
        if abs(shoulder_waist_diff) < 5 and abs(shoulder_hip_diff) < 5:
            return "Прямоугольник"

        # Треугольник: узкие плечи, бёдра шире
        if shoulder_hip_diff < -3 and hips > bust:
            return "Треугольник"

        # Овал / Яблоко: талия сильно шире и плеч, и бёдер
        if waist > bust and waist > hips:
            return "Овал"

    return "Неопределённый тип фигуры"
