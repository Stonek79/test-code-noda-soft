import React, { memo, ReactElement, MouseEvent } from "react";
import { btnName } from "./consts/consts";

// Тип any рекомендуется использовать только в крайних случаях
// В данном случае onClick - функция, которая ничего не возвращает
// Добавлен соответствующий тип
interface IButtonProps {
    onClick: (event: MouseEvent) => void;
}

// Переделал в стрелочную функцию, добавил мемоизацию, заменил тип на ReactElement
// Добавлено константное название кнопки
export const Button = memo(({ onClick }: IButtonProps): ReactElement => {
    return (
        <button type='button' onClick={ onClick }>
            {btnName}
        </button>
    );
})


// Начальный код

// interface IButtonProps {
//     onClick: any;
// }
//
// function Button({ onClick }: IButtonProps): JSX.Element {
//     return (
//         <button type="button" onClick={onClick}>
//             get random user
//         </button>
//     );
// }
