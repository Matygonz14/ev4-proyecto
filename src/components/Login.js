import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../helpers/useAuth';
import config from '../helpers/config.json';

const Login = () => {
    const { setAuth } = useAuth();
    let navigate = useNavigate();

    const changeButtonState = (button, enabled) => {
        if(enabled){
            button.disabled = false;
            button.innerHTML = "<i class='fa fa-sign-in'></i> Acceder";
        }else {
            button.disabled = true;
            button.innerHTML = "<i class='fa fa-spin fa-spinner'></i> Accediendo...."
        }
    };

    const showMessage = (visible, message) => {
        const messageBox = document.querySelector('.alert');
        const reasonBox = document.querySelector('#reason');
        if(visible){
            reasonBox.innerHTML = message;
            messageBox.classList.remove('d-none')
        }else {
            reasonBox.innerHTML = "";
            messageBox.classList.add("d-none")
        }
    };

    const logger = async (event) => {
        event.preventDefault();
        const button = document.querySelector('button');
        changeButtonState(button, false);

        var {username, pass} = document.forms[0];
        const user = username.value;
        const password = pass.value;
        if(user.length === 0 || password.length ===0){
            showMessage(true, "Debe completar los campos solicitados");
            changeButtonState(button, true);
            return;
        };

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ nickname: user, password: password, operatorId: config.operatorId})
        };

        fetch(config.apiURL+"login", requestOptions).then((response) => {
            switch(response.status){
                case 403:
                    showMessage(true, "Acceso prohibido");
                    changeButtonState(button, true);
                    break;
                case 404:
                    showMessage(true, "Nombre de usuario o la clave estan incorrectos");
                    changeButtonState(button, true);
                    break;
                    default:
                        //
            }
            return response.json();
        }).then((result) => {
            if(!result.data[0].active){
                showMessage(true, "El usuario esta Inactivo");
                changeButtonState(button, true);
                return;
            }
            try {
                const infoData = result.data[0];
                const infoUser = JSON.stringify(infoData);
                showMessage(false,"");
                changeButtonState(button, true);
                localStorage.setItem("user", infoUser);
                const roles = [infoData['level']];
                /*setAuth({ user, password, roles});*/
                navigate('/sales');
            } catch (error) {
                console.log(error);
            }
        }).catch((_error) => {
            //
        })
    };

    return(
        <div className="hold-transition login-page">
            <div className="login-box">
                <div className="login-logo">
                    <a href="/"><b>Cloud</b>Sales</a>
                </div>
                <div className="card">
                    <div className="car-body login.card-body">
                        <p className="login-box-msg">Ingrese sus Datos para iniciar sesion</p>
                        <form onSubmit={logger}>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" id="username" name="username" placeholder="Apodo"></input>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" className="form-control" id="pass" name="pass" placeholder="Clave"></input>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 text-center">
                                    <button className="btn btn-primary"><i className="fa fa-sign-in"></i>Ingresar</button>
                                </div>
                            </div>
                        </form>
                        <div className="alert alert-danger d-none" role="alert">
                            <strong>Error!</strong>
                            <p id="reason"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
