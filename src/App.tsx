// Мы ожидаем, что Вы исправите синтаксические ошибки, сделаете перехват возможных исключений и улучшите читаемость кода.
// А так же, напишите кастомный хук useThrottle и используете его там где это нужно.
// Желательно использование React.memo и React.useCallback там где это имеет смысл.
// Будет большим плюсом, если Вы сможете закэшировать получение случайного пользователя.
// Укажите правильные типы.
// По возможности пришлите Ваш вариант в https://codesandbox.io

import React, {useCallback, useState, MouseEvent, memo, ReactElement} from "react";
import { Button } from "./Button";
import { UserInfo } from "../UserInfo";
import { User } from "./types";
import { useThrottle } from "./hooks/useThrottle";
import { headerName, URL } from "./consts/consts";

// Декомпозировал код
// Константу URL перенес в файл с константами
// Типы вынес в отдельный модуль
// Компоненты Button и UserInfo вынес в отдельные модули

// Переделал в стрелочную функцию, добавил мемоизацию, заменил тип на ReactElement
// Компонент Арр является основой, в которой реализуется логика приложения
// (запросы на сервер, работа с состоянием)
const App = (): ReactElement => {
    // Добавлено состояние для кэша
    const [userCache, setUserCache] = useState<Record<number, User>>({});
    // Исправлены наименования на семантически более подходящие
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    // Добавлено состояние загрузки
    const [isLoading, setIsLoading] = useState(false);
    console.log('RENDER', userCache)
    // Добавлено кэширование пользователей
    // Если пользователь уже был запрошен и закэширован, данные берутся из кэша userCache.
    // Функция cacheUser обновляет состояние userCache с новым значением.
    // Используется колбэк (prevCache => ({ ...prevCache, [id]: user }))
    // для обеспечения корректного обновления кэша без изменения предыдущего состояния напрямую.
    // Таким образом, функция cacheUser обновляет userCache, добавляя или обновляя данные пользователя в кэше,
    // используя его id идентификатор в качестве ключа.
    const cacheUser = (id: number, user: User | null) => {
        setUserCache((prevCache) => ({
            ...prevCache,
            [id]: user,
        }));
    };

    // Добавлен блок try/catch для отлова и обработки ошибок и finally для управления спинера загрузки.
    // В случае ошибки при запросе, ошибка выводится в консоль.
    // В рабочем проекте можно написать логику обработки ошибки.
    // Добавлен хук useCallback потому что receiveRandomUser передается в другой хук - useThrottle.
    // В данном случае помогает оптимизировать производительность и предотвратить ненужные рендеры.
    const receiveRandomUser = useCallback(async (id: number) => {
        // В целом, стандартный запрос. Получаем пользователя, добавляем его в стэйт текущего пользователя
        // и в кэш, так как запрос на сервер идет только при отсутствии пользователя с текущим id в кэше
        try {
            setIsLoading(true); // Устанавливаем состояние загрузки перед запросом
            const response = await fetch(`${URL}/${id}`);
            const _user = (await response.json()) as User;
            setCurrentUser(_user);
            cacheUser(id, _user);
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setIsLoading(false); // Сбрасываем состояние загрузки после завершения запроса
        }
    }, [])

    // Добавлен троттлинг получения пользователя
    // Используется для задержки обновлений currentUser на 1 секунду,
    // чтобы избежать частого обновления интерфейса при быстром нажатии кнопки.
    const throttledReceiveRandomUser = useThrottle(receiveRandomUser, 1000);

    // Добавлен хук useCallback который используется в пропсах компонента Button.
    // Использование useCallback помогает оптимизировать производительность и избежать лишних ререндеров
    const handleButtonClick = useCallback(
        (event: MouseEvent) => {
            event.stopPropagation();
            // Получаем случайный идентификатор (id) пользователя в диапазоне с 1 по 10
            const id = Math.floor(Math.random() * 10) + 1;

            if (currentUser && currentUser.id === id) {
                return; // Если текущий пользователь уже загружен, не выполнять запрос
            }

            // Получаем кэшированного пользователя по id
            const cachedUser = userCache[id];

            // Далее проверяем, если в кэше пользователь с таким id уже имеется, то мы отрисовываем его,
            // если такого нет, делается запрос на API для получения нового пользователя,
            // который добавляется в кэш, стейт с пользователем и отрисовывается
            if (cachedUser) {
                setCurrentUser(cachedUser);
            } else
            throttledReceiveRandomUser(id);
        },
        [throttledReceiveRandomUser, userCache]
    );

    return (
        <div>
            {/* Добавлено константное название заголовка, скорректированы названия пропсов */}
            <header>{headerName}</header>
            <Button onClick={handleButtonClick} />
            {/* Добавлено отображение загрузки с сервера по условию для более корректного UI/UX */}
            {/* Это также дает понимание когда данные грузятся с сервера, а когда берутся из кэша */}
            {isLoading && (
                <p>Loading...</p>
            )}
            <UserInfo user={currentUser} />
        </div>
    );
}

// Добавлена мемоизация
export default memo(App)
