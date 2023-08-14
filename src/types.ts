// Типы вынесены в отдельный модуль в целях декомпозиции,
// Добавлен тип Address
type Company = {
    bs: string;
    catchPhrase: string;
    name: string;
};

type Address = {
    street: string,
    suite: string,
    city: string,
    zipcode: string,
    geo: {
        lat: string,
        lng: string
    }
};

// Тип any в значении address заменен на новый тип Address в соответствии с данными которые приходят с сервера
// Тип any крайне не рекомендуется использовать в типизации получаемых данных, это black box
export type User = {
    id: number;
    email: string;
    name: string;
    phone: string;
    username: string;
    website: string;
    company: Company;
    address: Address
};
