import { useState, useEffect } from "react";
import "./App.css";
import Cookies from "js-cookie";
import InputMask from "react-input-mask";

const api_url = "http://127.0.0.1:8000/api/";

const Success = () => {
    const [success, setSuccess] = useState(false);

    const checkSuccess = () => {
        setSuccess(Cookies.get("success") === "True");
    };
    useEffect((_) => {
        checkSuccess();
    }, []);
    return (
        <>
            {success ? (
                <div className="success secret">
                    <div className="success__data">
                        <h2>Успешно</h2>
                        <p>Мы вам наберем если ваша заявка будет одобрена</p>
                        <button
                            onClick={(_) => {
                                Cookies.remove("success");
                                setSuccess(false);
                                window.location.reload();
                            }}
                        >
                            Хорошо
                        </button>
                    </div>
                </div>
            ) : Cookies.get("success") === "False" ? (
                <div className="success secret">
                    <div className="success__data">
                        <h2>Не Успешно</h2>

                        {Cookies.get("err") === "russian_name" ? (
                            <p>
                                Ваше имя можно написать только на русском, можно
                                использовать точки и тире
                            </p>
                        ) : Cookies.get("err") === "pet_name" ? (
                            <p>
                                В имени питомца можно указать только русские,
                                английские символы, а также точки и тире
                            </p>
                        ) : (
                            <p>Заявка на выбранную дату уже присутствует</p>
                        )}

                        <button
                            onClick={(_) => {
                                Cookies.remove("success");
                                Cookies.remove("err");

                                setSuccess(false);
                                window.location.reload();
                            }}
                        >
                            Хорошо
                        </button>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
};

const AdminPanel = ({ setLogged }) => {
    const [appointments, setAppointments] = useState({});
    const [services, setServices] = useState({});

    const csrf = Cookies.get("csrftoken");

    const deleteAppointment = (appoint) => {
        fetch(api_url + "appointment/" + appoint + "/", {
            credentials: "include",
            headers: {
                "X-CsrfToken": csrf,
            },
            method: "DELETE",
        });
        window.location.reload();
    };
    const Approve = (appoint, id) => {
        fetch(api_url + "appointment/" + appoint + "/", {
            credentials: "include",
            headers: {
                "X-CsrfToken": csrf,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                approved: !appointments[id].approved,
            }),
            method: "PATCH",
        });
        window.location.reload();
    };

    const getAppointments = () => {
        fetch(api_url + "appointment/", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => setAppointments(data));
    };
    const getServices = () => {
        fetch("http://127.0.0.1:8000/services/", {
            credentials: "include",
            headers: {
                "X-CSRFToken": csrf,
            },
        })
            .then((resp) => resp.json())
            .then((data) => setServices(data));
    };

    const changeVisibility = (mark, id) => {
        console.log(services[id].is_active);
        fetch("http://127.0.0.1:8000/api/services/" + mark + "/", {
            credentials: "include",
            headers: {
                "X-CSRFToken": csrf,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                is_active: !services[id].is_active,
            }),
            method: "PATCH",
        });
        window.location.reload();
    };
    let render = [];
    let service_render = [];

    for (let i = 0; i < services.length; i++) {
        service_render.push(
            <div key={"service-" + services[i].id} className="admin__services">
                <p>{services[i].name}</p>
                <form>
                    <input
                        type="checkbox"
                        name="is_active"
                        id={"is_active-" + services[i].id}
                        defaultChecked={services[i].is_active}
                        onClick={(_) => changeVisibility(services[i].id, i)}
                    />
                </form>
            </div>
        );
    }
    for (let i = 0; i < appointments.length; i++) {
        render.push(
            <div key={appointments[i].id} className="appointment__user">
                {appointments[i].approved ? <p>✓</p> : <p>X</p>}
                <p>
                    <b>{appointments[i].name}</b>
                </p>
                <p>{appointments[i].time_of_appointment}</p>
                <p>{appointments[i].date_of_appointment}</p>

                <p>{appointments[i].phone}</p>
                <div>
                    <button
                        onClick={(_) => {
                            Approve(appointments[i].id, i);
                        }}
                    >
                        (не)одобрить
                    </button>
                    <button
                        onClick={(_) => {
                            deleteAppointment(appointments[i].id);
                        }}
                    >
                        удалить
                    </button>
                </div>
            </div>
        );
    }
    useEffect((_) => {
        getAppointments();
        getServices();
    }, []);
    return (
        <div className="admin">
            <button onClick={(_) => setLogged(false)}>X</button>
            <div className="list__admin">{render}</div>
            {service_render}
        </div>
    );
};

const OpenAdmin = () => {
    const [logged, setLogged] = useState(false);
    const [opened, setOpened] = useState(false);

    const csrf = Cookies.get("csrftoken");

    const checkLogged = (bl) => {
        setOpened(bl);
        fetch("http://127.0.0.1:8000/logged", { credentials: "include" })
            .then((resp) => resp.json())
            .then((data) => setLogged(data["logged"]));
    };

    return (
        <div>
            <button
                onClick={(_) => checkLogged(true)}
                className="open__admin"
            ></button>
            {logged && opened ? (
                <div className="secret">
                    <AdminPanel setLogged={setOpened} />
                </div>
            ) : opened ? (
                <div className="secret">
                    <form
                        className="secret__form"
                        action="http://127.0.0.1:8000/login/"
                        method="post"
                    >
                        <input
                            type="hidden"
                            name="csrfmiddlewaretoken"
                            value={csrf}
                        ></input>
                        <input
                            type="text"
                            name="username"
                            maxLength="150"
                            required
                            id="id_username"
                            placeholder="name"
                        ></input>
                        <input
                            type="password"
                            name="password"
                            required=""
                            id="id_password"
                            placeholder="password"
                        ></input>
                        <input
                            type="hidden"
                            name="next"
                            value="http://localhost:3000/"
                        ></input>
                        <button type="submit">войти</button>
                    </form>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

const Contacts = ({ company }) => {
    return (
        <section className="contacts">
            <h2>Свяжитесь с нами</h2>
            <div className="contacts__blocks">
                <div className="contacts__block">
                    <h3>Адрес</h3>
                    <p className="contacts__data">{company.addres}</p>
                </div>
                <div className="contacts__block">
                    <h3>Почта</h3>
                    <p className="contacts__data">{company.email}</p>
                </div>
                <div className="contacts__block">
                    <h3>Телефон</h3>
                    <p className="contacts__data">{company.phone}</p>
                </div>
                <div className="contacts__block">
                    <h3>Ссылки</h3>
                    <p className="contacts__data">{company.links}</p>
                </div>
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
            <div key={reviews[i].name}>
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

const Appointment = ({ open_form, service_id }) => {
    let dat = new Date();
    let year = dat.getFullYear();
    let month = dat.getMonth() + 1;
    let day = dat.getDate();

    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    const csrf = Cookies.get("csrftoken");
    const [phone, setPhone] = useState("");

    return (
        <div className="appointment">
            <form
                action={api_url + "appointment/"}
                method="post"
                className="appointment__form"
            >
                <input
                    type="hidden"
                    name="csrfmiddlewaretoken"
                    value={csrf}
                ></input>
                <div className="appointment__data">
                    <button
                        onClick={(_) => open_form(false)}
                        className="appointment__close"
                    >
                        X
                    </button>
                    <p>Записаться</p>
                </div>
                <input type="hidden" name="service" value={service_id} />
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Ваше имя"
                    required
                />
                <input
                    type="text"
                    name="pet_name"
                    id="pet_name"
                    placeholder="Имя питомца"
                    required
                />
                <InputMask
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    mask="+7\(999)999-99-99"
                    maskChar=" "
                    placeholder="+7 (000)000-00-00"
                />
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="e-mail"
                    required
                />
                <input
                    type="date"
                    name="date_of_appointment"
                    id="date_of_appointment"
                    placeholder="дата"
                    data-date-format="DD MM YYYY"
                    defaultValue={`${year}-${month}-${day}`}
                    min={`${year}-${month}-${day}`}
                    required
                />
                <input
                    type="time"
                    name="time_of_appointment"
                    id="time_of_appointment"
                    min="08:00"
                    max="22:00"
                />
                <button type="submit">Забронировать</button>
            </form>
        </div>
    );
};

const Services = ({ open_form, service_id, services, setServices }) => {
    const [filters, setFilters] = useState({ min: 0, max: 999999999 });

    let render = [];

    const getServices = () => {
        fetch(
            api_url +
                "services/?" +
                `min=${filters["min"]}&max=${filters["max"]}`
        )
            .then((promise) => promise.json())
            .then((data) => setServices(data));
        render = getServiceRender()
    };
    const openForm = (service) => {
        service_id(service);
        open_form(true);
    };
    const setNewFilters = () => {
        const min = document.getElementById("min").value;
        const max = document.getElementById("max").value;
        setFilters({ min: min, max: max });
        getServices();
        render = getServiceRender();
    };
    const getServiceRender = () => {
        let rend = [];

        for (let i = 0; i < services.length; i++) {
            rend.push(
                <div key={services[i].id} className="service">
                    <p>
                        <b>{services[i].name}</b>
                    </p>
                    <p>
                        <i>{services[i].detail}</i>
                    </p>
                    <p>{services[i].cost.toLocaleString()}р</p>
                    <button
                        onClick={(_) => {
                            openForm(services[i].id);
                        }}
                    >
                        Забронировать
                    </button>
                </div>
            );
        }
        return rend;
    };

    useEffect((_) => {
        getServices();
    }, []);
    render = getServiceRender();
    return (
        <section className="services">
            <h2>Наши услуги</h2>
            <div>
                <label for="min">цена </label>
                <input
                    type="number"
                    min={0}
                    placeholder="мин цена"
                    defaultValue={0}
                    id="min"
                    name="min"
                />
                -
                <input
                    type="number"
                    min={0}
                    placeholder="макс цена"
                    defaultValue={99999999}
                    id="max"
                    name="max"
                />
                <button
                    onClick={(_) => {
                        setNewFilters();
                    }}
                >
                    Применить
                </button>
                <button onClick={(_) => window.location.reload()}>
                    сбросить
                </button>
            </div>
            <div className="services__blocks">{render}</div>
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
    const [form_opened, setFormOpened] = useState(false);
    const [service_id, setServiceId] = useState(0);
    const [services, setServices] = useState({});

    const GetCompanyData = () => {
        fetch(api_url + "company/1", { credentials: "include" })
            .then((data) => data.json())
            .then((data) => setCompany(data));
    };

    useEffect((_) => {
        GetCompanyData();
    }, []);
    return (
        <div className="App">
            {form_opened ? (
                <Appointment
                    open_form={setFormOpened}
                    service_id={service_id}
                />
            ) : (
                <></>
            )}
            <Main company={Company} />
            <Services
                open_form={setFormOpened}
                service_id={setServiceId}
                setServices={setServices}
                services={services}
            />
            <Reviews />
            <Contacts company={Company} />
            <OpenAdmin services={services} />

            <iframe
                title="lol"
                src="http://127.0.0.1:8000/admin/login/?next=/admin/"
                hidden
            />
            <Success />
        </div>
    );
};

export default App;
