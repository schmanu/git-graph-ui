import './App.css';
import React from 'react';
import { Gitgraph, Mode } from '@gitgraph/react';
import { useStyles } from './styles/Styles';
import { AppBar, Grid, IconButton, Paper, Toolbar, Typography } from '@material-ui/core';
import { DynamicGitgraph } from './components/DynamicGitgraph';



function App() {

  const classes = useStyles();


  return (
    <div>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <AppBar position="static">
                <Toolbar>
                  <Typography variant="h6" className={classes.title}>
                    GitGraph Viz Tool
                  </Typography>
                </Toolbar>
              </AppBar>
            </Grid>
            <DynamicGitgraph classes={classes} />
          </Grid>

        </div>
    </div>
  );
}

export default App;
