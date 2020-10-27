import { Branch, Gitgraph } from "@gitgraph/react";
import { Button, Grid, IconButton, InputBase, MenuItem, Paper, TextareaAutosize, TextField } from "@material-ui/core";
import React from "react";
import Add from "@material-ui/icons/Add";
import { useStyles } from "../styles/Styles";


export enum DialogMode {
    CreateCommit,
    CreateBranch,
}

export class DynamicGitgraph extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            branches: ["master"],
            dialogMode: DialogMode.CreateCommit, 
        }
    }


    public addBranch(branchName: string) {
        this.state.gitgraph.branch(branchName);
    }

    public render = () => {
        return (

            <><Grid item xs={5}>
                <form noValidate autoComplete="off" style={{padding: 10,}}>
                        {this.state.dialogMode === DialogMode.CreateCommit ? (
                        <div>
                            <TextField 
                                id="branchName" 
                                select 
                                label="Branch"
                                helperText="Please select a branch to commit to">
                                {this.state.branches
                                    .map((b: Branch) => b.name)
                                    .map((branchName: string) => {
                                        <MenuItem key={branchName} value={branchName}>
                                            {branchName}
                                        </MenuItem>
                                    })}
                            </TextField>
                            <IconButton onClick={((event) => {
                                this.setState({dialogMode : DialogMode.CreateBranch})
                            })}>
                                <Add />
                            </IconButton>
                        </div>
                        ) : (<div />)}
                   {this.state.dialogMode === DialogMode.CreateCommit ? (
                    <div>
                        <div>
                            <TextField id="commitText" label="Commit Text" multiline rows={3} />
                        </div>
                    
                        <div>
                            <Button variant="contained" color="secondary">
                                Send Commit
                            </Button>
                        </div>
                    </div>
                   ) : (
                    <div>
                        <div>
                            <TextField id="branchName" label="Branch Name" />
                        </div>
                        <div style={{paddingTop: 10,}}>
                            <Button variant="contained" color="secondary">
                                Create Branch
                            </Button>
                            <Button variant="contained" color="default" onClick={((event) => {
                                this.setState({dialogMode : DialogMode.CreateCommit})
                            })}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                   )}
                </form>
            </Grid>
                <Grid item xs={7}>
                    <Gitgraph children={(gitgraph) => this.setState({ gitgraph })} />
                </Grid></>
        );
    }
}