import React, { useContext, useEffect, useState } from 'react';
import bemCssModules from 'bem-css-modules';

import Modal from '../../Modal/Modal'

import { default as FormStyles } from './LoginForm.module.scss';
import { StoreContext } from '../../../store/StoreProvider';
import request from '../../../helpers/request';

const style = bemCssModules(FormStyles);

const LoginForm = ({ handleOnClose, isModalOpen }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [validateMessage, setValidateMessage] = useState('');

    const { setUser } = useContext(StoreContext);

    const handleOnChangeLogin = ({ target }) => setLogin(target.value)
    const handleOnChangePassword = ({ target }) => setPassword(target.value)
    const handleOnCloseModal = event => {
        event.preventDefault();
        handleOnClose();
    }

    const resetStateOfInputs = () => {
        setLogin('');
        setPassword('');
        setValidateMessage('');
    }

    const handleOnSubmit = async event => {
        event.preventDefault();
        const { data, status } = await request.post(
            '/users',
            { login, password }
        );

        if (status === 200) {
            setUser(data.user);
            resetStateOfInputs();
            handleOnClose();
        } else {
            setValidateMessage(data.message);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            resetStateOfInputs()
        }
    }, [isModalOpen]);

    const ValidateMessageComponent = validateMessage.length ?
        <p className={style('validate-message')}>{validateMessage}</p>
        : null;

    return (
        <Modal isOpen={isModalOpen}>
            <form className={style()} method='post' onSubmit={handleOnSubmit}>
                <label className={style('title')}>Login</label>
                <input className={style('input')} onChange={handleOnChangeLogin} type="text" value={login} />
                <label className={style('title')}>Hasło</label>
                <input className={style('input')} onChange={handleOnChangePassword} type="password" value={password} />
                <button className={style('btn')} type='submit'>Zaloguj</button>
                <button className={style('btn')} onClick={handleOnCloseModal} type='button'>Anuluj</button>
                {ValidateMessageComponent}
            </form>
        </Modal>
    );
};

export default LoginForm;