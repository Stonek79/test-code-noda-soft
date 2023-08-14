import React, {memo, ReactElement} from "react";
import {User} from "./src/types";
import {tHeadPhone, tHeadUsername} from "./src/consts/consts";

interface IUserInfoProps {
    user: User;
}

// Переделал в стрелочную функцию, добавил мемоизацию, заменил тип на ReactElement
// Добавил константы в заголовки таблицы, поставил гард на получение пропса User,
// Явно достал значения из пропса User для удобства читаемости
// Компонент для отрисовки данных пользователя, принимает пропс с данными о пользователе
export const UserInfo = memo(({ user }: IUserInfoProps): ReactElement => {
    if (user) {
        const { name, phone} = user

        return (
            <table>
                <thead>
                <tr>
                    <th>{tHeadUsername}</th>
                    <th>{tHeadPhone}</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{name}</td>
                    <td>{phone}</td>
                </tr>
                </tbody>
            </table>
        );
    }
})

// Начальный код

// interface IUserInfoProps {
//     user: User;
// }
//
// function UserInfo({ user }: IUserInfoProps): JSX.Element {
//     return (
//         <table>
//             <thead>
//             <tr>
//                 <th>Username</th>
//                 <th>Phone number</th>
//             </tr>
//             </thead>
//             <tbody>
//             <tr>
//                 <td>{user.name}</td>
//                 <td>{user.phone}</td>
//             </tr>
//             </tbody>
//         </table>
//     );
// }
