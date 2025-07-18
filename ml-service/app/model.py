def predict_body_type(features: list[float]) -> str:
    """
    features: [bust, waist, hips, height]
    Returns: body shape string (на русском)
    """
    bust, waist, hips, height = features

    bust_hips_diff = bust - hips
    hips_bust_diff = hips - bust
    bust_waist_diff = bust - waist
    hips_waist_diff = hips - waist

    # Песочные часы
    if (
        abs(bust_hips_diff) <= 1
        and (bust_waist_diff >= 11 or hips_waist_diff >= 11)
    ):
        return "Песочные часы"

    # Песочные часы с акцентом на бёдра
    if (
        3.6 <= hips_bust_diff < 10
        and hips_waist_diff >= 11
    ):
        return "Песочные часы"

    # Песочные часы с акцентом на грудь
    if (
        1 < bust_hips_diff < 10
        and bust_waist_diff >= 11
    ):
        return "Песочные часы"

    # Груша
    if (
        hips_bust_diff > 2
        and hips_waist_diff >= 7
    ):
        return "Груша"

    # Перевёрнутый треугольник
    if (
        bust_hips_diff >= 5  # грудь существенно шире бёдер
        and hips_waist_diff < 11  # бёдра не сильно выделены
        and bust_waist_diff >= 5  # грудь явно шире талии
    ):
        return "Перевёрнутый треугольник"

    # Яблоко
    if (
        bust_hips_diff >= 3.6
        and waist >= hips  # живот шире бёдер
    ):
        return "Яблоко"

    # Прямоугольник
    if (
        abs(bust_hips_diff) < 3.6
        and bust_waist_diff < 11
        and hips_waist_diff < 11
    ):
        return "Прямоугольник"

    return "Неопределённый тип фигуры"

