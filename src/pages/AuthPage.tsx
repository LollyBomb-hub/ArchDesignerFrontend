import React, {useEffect, useState} from "react";
import {IRootState} from "../store/store";
import {connect, ConnectedProps} from "react-redux";
import {
    Alert,
    AppBar, Box,
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
import ActionToolbar from './components/ActionToolbar'
import {AccountCircle, Lock, Send} from "@mui/icons-material";
import {auth, resetAuthState, selectMenuItem, toolbarClick} from "../store/reducers/accountReducer";
import moment from "moment";
import {Outlet, useSearchParams, Link} from "react-router-dom";
import MuiLink from "@mui/material/Link";

interface IProps extends ReduxProps {
}

const mapState = (state: IRootState) => (
    {
        loggedIn: state.accountSlice.loggedIn,
        loadingState: state.accountSlice.loadingState,
        expiresAt: state.accountSlice.expiresAt,
        closedToolbar: state.accountSlice.closedActionToolbar,
        currentMenuItem: state.accountSlice.currentMenuItem
    }
)

const mapDispatchToProps = {auth, resetAuthState, toolbarClick, selectMenuItem}

const connector = connect(mapState, mapDispatchToProps)

type ReduxProps = ConnectedProps<typeof connector>;

const AuthPage = (props: IProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const isRegistered = searchParams.get("r") === '1';
    const errored = props.loadingState === 'ERRORED';
    // console.log(props.expiresAt, moment().unix(), props.loggedIn)
    const authorized = props.loggedIn && (props.expiresAt !== undefined ? props.expiresAt > moment().unix() : false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [open, setOpen] = useState(isRegistered)
    const [openErrorMessage, setOpenErrorMessage] = useState(errored)
    useEffect(
        () => {
            if (openErrorMessage !== errored) {
                setOpenErrorMessage(errored)
            }
        }, [openErrorMessage, errored]
    )
    if (authorized) {
        return (
            <Box component={'div'} sx={{display: 'flex'}}>
                <ActionToolbar
                    currentMenuItem={props.currentMenuItem}
                    selectMenuItem={props.selectMenuItem}
                    open={!props.closedToolbar}
                    onToolbarClick={props.toolbarClick}/>
                <Box component={"main"} sx={{flexGrow: 1}}>
                    <Outlet/>
                </Box>
            </Box>
        )
    }
    const handleClose = (setter: (f: boolean) => void, modifyParams: boolean) => (() => {
        setter(false);
        if (modifyParams) {
            setSearchParams({})
        } else {
            props.resetAuthState()
        }
    })
    return (
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose(setOpen, true)}>
                <Alert onClose={handleClose(setOpen, true)} severity="success" sx={{width: '100%'}}>
                    Теперь Вы можете авторизоваться
                </Alert>
            </Snackbar>
            <Snackbar open={openErrorMessage} autoHideDuration={6000} onClose={handleClose(setOpenErrorMessage, false)}>
                <Alert onClose={handleClose(setOpenErrorMessage, false)} severity="error" sx={{width: '100%'}}>
                    Ошибка авторизации!<br/>Проверьте верность данных!
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
            <Grid style={{height: "100vh", backgroundImage: 'url("/background_auth.png")', backgroundSize: "100% 100%"}}
                  justifyContent="center"
                  alignItems="center" container direction="row">
                <Grid item>
                    <Paper elevation={16}>
                        <Grid container width={400} justifyContent="center" alignItems="center" direction="column"
                              spacing={1}
                              padding={1}>
                            <Grid item>
                                <div>
                                    <h3>Требуется авторизация</h3>
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
                                            <TextField onKeyUp={(e) => {
                                                if (e.key === 'Enter') {
                                                    if (username !== "" && password !== "") {
                                                        props.auth({
                                                            username: username,
                                                            password: password
                                                        })
                                                    }
                                                }
                                            }} onInput={(e) => {
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
                                    <Grid item container justifyContent="center">
                                        <Link to={"/register"}><MuiLink
                                            component={"span"}>Зарегистрироваться</MuiLink></Link>
                                    </Grid>
                                    <Grid item>
                                        <Grid container direction="row-reverse">
                                            <Button onClick={() => props.auth({
                                                username: username,
                                                password: password
                                            })} color="success" variant="contained" type="submit" endIcon={<Send/>}>
                                                Войти
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

export default connector(AuthPage)