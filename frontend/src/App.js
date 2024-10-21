import { useState, useEffect } from "react";
import "./App.css";

const api_url = "http://127.0.0.1:8000/api/";

const Contacts = ({ company }) => {
    return (
        <section>
            <h2>Свяжитесь с нами</h2>
            <div>
                <p>{company.addres}</p>
                <p>{company.email}</p>
                <p>{company.phone}</p>
                <p>{company.links}</p>
            </div>
        </section>
    );
};

const Reviews = () => {
    const [reviews, setReviews] = useState({});

    const getServices = () => {
        fetch(api_url + "reviews/")
            .then((promise) => promise.json())
            .then((data) => setReviews(data));
    };
    let render = [];

    for (let i = 0; i < reviews.length; i++) {
        render.push(
            <div>
                <p>
                    <b>{reviews[i].name}</b>
                </p>
                <br />
                <p>{reviews[i].content}</p>
            </div>
        );
    }

    useEffect((_) => {
        getServices();
    }, []);
    // ("reviews/");
    return (
        <section className="reviews">
            <h2>Отзывы</h2>
            <div className="reviews__block">{render}</div>
        </section>
    );
};

const Appointment = ({ open_form }) => {
    let dat = new Date()
    let year = dat.getFullYear()
    let month = dat.getMonth() + 1
    let day = dat.getDate()
    day = day < 10 ? `0${day}` : day
    month = month < 10 ? `0${month}` : month;
    console.log(`${year}-${month}-${day}`)
    return (
        <form
            action={api_url + "appointment/"}
            method="post"
            className="appointment__form"
        >
            <button onClick={(_) => open_form(false)}>X</button>
            <input type="hidden" name="service-id" />
            <input type="text" name="name" id="name" placeholder="Ваше имя" />
            <input
                type="text"
                name="pet_name"
                id="pet_name"
                placeholder="Имя питомца"
            />
            <input type="tel" name="tel" id="tel" placeholder="+7987654321" />
            <input type="email" name="email" id="email" placeholder="e-mail" />
            <input
                type="date"
                name="date"
                id="date"
                placeholder="дата"
                defaultValue={`${year}-${month}-${day}`}
                min={`${year}-${month}-${day}`}
            />
            <input type="time" name="time" id="time" />
            <button type="submit">Записаться</button>
        </form>
    );
};

const Services = ({ open_form }) => {
    const [services, setServices] = useState({});

    const getServices = () => {
        fetch(api_url + "services/")
            .then((promise) => promise.json())
            .then((data) => setServices(data));
    };
    const openForm = (service) => {
        open_form(true)
    }
    let render = [];

    for (let i = 0; i < services.length; i++) {
        render.push(
            <div>
                <p>
                    <b>{services[i].name}</b>
                </p>
                <p>{services[i].cost}</p>
                <button onClick={(_) => {openForm(services[i].id)}}>Оставить заявку</button>
            </div>
        );
    }

    useEffect((_) => {
        getServices();
    }, []);
    return (
        <section>
            <h2>Наши услуги</h2>
            <div>{render}</div>
        </section>
    );
};

const Header = ({ company }) => {
    return (
        <header>
            <p>{company.name}</p>
            <p>{company.city}</p>
        </header>
    );
};

const Main = ({ company }) => {
    return (
        <main className="main">
            <Header company={company} />
            <div className="main__wrap">
                <h1>
                    <b>{company.name}</b>
                </h1>
                <p>{company.slogan}</p>
            </div>
        </main>
    );
};

const App = () => {
    const [Company, setCompany] = useState({});
    const [form_opened, setFormOpened] = useState(false)
    const GetCompanyData = () => {
        fetch(api_url + "company/1", { credentials: "include" })
            .then((data) => data.json())
            .then((data) => setCompany(data));
    };
    // console.log(Company);
    useEffect((_) => {
        GetCompanyData();
    }, []);
    return (
        <div className="App">
            {form_opened ? <Appointment open_form={setFormOpened} /> : <></>}
            <Main company={Company} />
            <Services open_form={setFormOpened} />
            <Reviews />
            <Contacts company={Company} />
        </div>
    );
};

export default App;
