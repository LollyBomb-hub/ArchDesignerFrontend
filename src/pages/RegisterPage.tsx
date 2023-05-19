import React, {useEffect, useState} from "react";
import {IRootState} from "../store/store";
import {connect, ConnectedProps} from "react-redux";
import {
    Alert,
    AppBar,
    Button,
    Container,
    FormControl,
    Grid,
    InputAdornment,
    Paper,
    Snackbar,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {AccountCircle, Lock, Send} from "@mui/icons-material";
import {register, resetRegisterState} from "../store/reducers/accountReducer";
import {useNavigate, Link} from "react-router-dom";
import MuiLink from "@mui/material/Link";

interface IProps extends ReduxProps {
}

const mapState = (state: IRootState) => (
    {
        loadingState: state.accountSlice.registrationState,
    }
)

const mapDispatchToProps = {register, resetRegisterState}

const connector = connect(mapState, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>;

const RegisterPage = (props: IProps) => {
    let nav = useNavigate();
    const errored = props.loadingState === 'ERRORED';
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [openErrorMessage, setOpenErrorMessage] = useState(errored)
    useEffect(
        () => {
            if (openErrorMessage !== errored) {
                setOpenErrorMessage(errored)
            }
        }, [openErrorMessage, errored]
    )
    const handleClose = (setter: (f: boolean) => void) => (() => {
        setter(false);
        props.resetRegisterState()
    })
    if (props.loadingState === 'DONE') {
        props.resetRegisterState()
        nav("/?r=1")
    }
    return (
        <>
            <Snackbar open={openErrorMessage} autoHideDuration={6000} onClose={handleClose(setOpenErrorMessage)}>
                <Alert onClose={handleClose(setOpenErrorMessage)} severity="error" sx={{width: '100%'}}>
                    Ошибка регистрации!<br/>Такой аккаунт уже существует.
                </Alert>
            </Snackbar>
            <Grid item container justifyContent="center">
                <AppBar color={"default"} className="header" position="absolute" style={{
                    width: "90%",
                    right: "auto",
                    marginTop: "10px",
                    backgroundColor: "#ffffff"
                }}>
                    <Container maxWidth="xl">
                        <Toolbar style={{justifyContent: 'center'}} disableGutters>
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="/"
                                sx={{
                                    mr: 2,
                                    display: 'flex',
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                PackDesigner
                            </Typography>
                        </Toolbar>
                    </Container>
                </AppBar>
            </Grid>
            <Grid style={{height: "100vh", backgroundImage: 'url("background_auth.png")', backgroundSize: "100% 100%"}}
                  justifyContent="center"
                  alignItems="center" container direction="row">
                <Grid item>
                    <Paper elevation={16}>
                        <Grid container width={400} justifyContent="center" alignItems="center" direction="column"
                              spacing={1}
                              padding={1}>
                            <Grid item>
                                <div>
                                    <h3>Форма регистрации</h3>
                                </div>
                            </Grid>
                            <Grid item>
                                <Grid container direction="column" spacing={2}>
                                    <Grid item>
                                        <FormControl variant="standard">
                                            <TextField onInput={(e) => {
                                                setUsername((e.target as any).value)
                                            }} value={username} label={"Введите логин"} id="username-login" InputProps={
                                                {
                                                    startAdornment: <InputAdornment position="start">
                                                        <AccountCircle/>
                                                    </InputAdornment>
                                                }
                                            }/>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <FormControl variant="standard">
                                            <TextField onInput={(e) => {
                                                setPassword((e.target as any).value)
                                            }} value={password} type="password" placeholder={"Введите пароль"}
                                                       id="username-password" InputProps={
                                                {
                                                    startAdornment: <InputAdornment position="start">
                                                        <Lock/>
                                                    </InputAdornment>
                                                }
                                            }/>
                                        </FormControl>
                                    </Grid>
                                    <Grid item>
                                        <FormControl variant="standard">
                                            <TextField onKeyUp={(e) => {
                                                if (e.key === 'Enter') {
                                                    if (username !== "" && password !== "" && password === passwordConfirmation) {
                                                        props.register({
                                                            name: username,
                                                            password: password
                                                        })
                                                    }
                                                }
                                            }} onInput={(e) => {
                                                setPasswordConfirmation((e.target as any).value)
                                            }} value={passwordConfirmation} type="password"
                                                       placeholder={"Повторите пароль"}
                                                       id="username-password-confirm" InputProps={
                                                {
                                                    startAdornment: <InputAdornment position="start">
                                                        <Lock/>
                                                    </InputAdornment>
                                                }
                                            }/>
                                        </FormControl>
                                    </Grid>
                                    <Grid item container justifyContent="center">
                                        <Link to={"/"}><MuiLink component={"span"}>Авторизоваться</MuiLink></Link>
                                    </Grid>
                                    <Grid item>
                                        <Grid container direction="row" alignItems={"center"} justifyContent={"center"}>
                                            <Button disabled={passwordConfirmation !== password || password.trim().length === 0}
                                                    onClick={() => props.register({
                                                        name: username,
                                                        password: password
                                                    })} color="success" variant="contained" type="submit"
                                                    endIcon={<Send/>}>
                                                Зарегистрироваться
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default connector(RegisterPage)