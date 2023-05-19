import React from "react";
import {Grid, Paper, useTheme} from "@mui/material";
import {Error} from "@mui/icons-material";

export const UnexpectedErrorPage = () => {
    let theme = useTheme();
    return (
        <Grid style={{height: "100vh", backgroundColor: theme.palette.background.default}} justifyContent="center"
              alignItems="center" container direction="row">
            <Paper elevation={2}>
                <Grid container width={400} justifyContent="center" alignItems="center" direction="column" spacing={1}
                      padding={1} paddingTop={2}>
                    <Grid item>
                        <Error fontSize="large" color="error"/>
                    </Grid>
                    <Grid item>
                        <h2>Возникла ошибочка</h2>
                    </Grid>
                    <Grid item textAlign={"center"}>
                        <span>
                            Повторите попытку позже или не повторяйте попытку позже
                        </span>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}