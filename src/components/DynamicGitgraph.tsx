import { Branch, Gitgraph, Mode, templateExtend, TemplateName } from "@gitgraph/react";
import { Button, Grid, IconButton, InputBase, MenuItem, Paper, TextareaAutosize, TextField } from "@material-ui/core";
import React, { ReactSVGElement } from "react";
import Add from "@material-ui/icons/Add";
import { isMaster } from "cluster";
import { Clear, Info } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";


export enum DialogMode {
    CreateCommit,
    CreateBranch,
}

export class DynamicGitgraph extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            branches: [],
            dialogMode: DialogMode.CreateCommit,
            selectedBranchName : null,
            commitMessage : null,
        }

        this.handleBranchNameChange = this.handleBranchNameChange.bind(this);
        this.handleCommitMessageChange = this.handleCommitMessageChange.bind(this);
        this.addBranch = this.addBranch.bind(this);
        this.addCommit = this.addCommit.bind(this);
        this.handleCommitClick = this.handleCommitClick.bind(this);
    }

    private handleBranchNameChange(event: any) {
        this.setState({ branchName: event.target.value });
    }
    private handleCommitMessageChange(event: any) {
        this.setState({ commitMessage: event.target.value });
    }

    private handleCommitClick(commit: any) {
        console.log(commit);
        const firstParent: string = commit.branches[0];

        if (this.state.selectedBranchName === null) {
            this.setState({ selectedBranchName: firstParent });
        } else {
            if (this.state.selectedBranchName === firstParent) {
                this.setState({ selectedBranchName: null });
            } else {
                const newBranches: Branch[] = this.state.branches.map((branch: Branch) => {
                    if (branch.name === firstParent) {
                        branch.merge({
                            branch: this.state.branches.find((branch : Branch) => branch.name === this.state.selectedBranchName),
                            commitOptions: {
                                subject: "Merge " + this.state.selectedBranchName + " into " + branch.name,
                                onClick: this.handleCommitClick,
                            },
                        });
                    }
                    return branch;
                });
                this.setState({ selectedBranchName: null, branches : newBranches });
            }
        }
    }

    private addBranch(event: any) {
        if (this.state.branchName !== null) {
            if (this.state.selectedBranchName === null) {
                const newBranches = [...this.state.branches, this.state.gitgraph.branch(this.state.branchName)];
                this.setState({
                    branches: newBranches,
                    branchName: newBranches[0].name,
                    dialogMode: DialogMode.CreateCommit
                });
            } else {
                const selectedBranch : Branch | undefined = this.state.branches.find((branch : Branch) => branch.name === this.state.selectedBranchName);
                const newBranches = [...this.state.branches, selectedBranch?.branch(this.state.branchName)];
                this.setState({
                    branches: newBranches,
                    branchName: newBranches[0].name,
                    dialogMode: DialogMode.CreateCommit
                });
            }
        }
    }

    private addCommit(event: any) {
        if (this.state.commitMessage !== null) {
            const newBranches: Branch[] = this.state.branches.map((branch: Branch) => {
                if (branch.name === this.state.branchName) {
                    branch.commit({
                        subject: this.state.commitMessage,
                        onClick: this.handleCommitClick,
                    }
                    )
                }
                return branch;
            });
            this.setState({
                branches: newBranches,
            });
        }
    }

    public render = () => {
        const gitGraphTemplate = templateExtend(TemplateName.Metro, {
            colors: ["#F94144", "#F3722C", "#F8961E", "#F9844A", "#F9C74F", "#90BE6D", "#43AA8B", "#4D908E", "#577590", "#277DA1"],
            branch: {
              label: {
                display: false,
              },
            }
        });

        return (

            <><Grid item xs={5}>
                <form noValidate autoComplete="off" style={{ padding: 10, }}>
                    {this.state.dialogMode === DialogMode.CreateCommit ? (
                        <div>
                            <TextField
                                id="branchName"
                                select
                                label="Branch"
                                helperText="Please select a branch to commit to"
                                onChange={this.handleBranchNameChange}
                                value={this.state.branchName}>
                                {this.state.branches
                                    .map((branch: Branch) => (
                                        <MenuItem key={branch.name} value={branch.name}>
                                            {branch.name}
                                        </MenuItem>
                                    ))}
                            </TextField>
                            <IconButton onClick={((event) => {
                                this.setState({ dialogMode: DialogMode.CreateBranch, value: null })
                            })}>
                                <Add />
                            </IconButton>
                        </div>
                    ) : (<div />)}
                    {this.state.dialogMode === DialogMode.CreateCommit ? (
                        <div>
                            <div>
                                <TextField id="commitMessage" label="Commit Message" multiline rows={3} rowsMax={10} onChange={this.handleCommitMessageChange} />
                            </div>

                            <div style={{ paddingTop: 10, }}>
                                <Button variant="contained" color="secondary" onClick={this.addCommit}>
                                    Create Commit
                            </Button>
                            </div>
                        </div>
                    ) : (
                            <div>
                                <div>
                                    <TextField id="branchName" label="Branch Name" onChange={this.handleBranchNameChange} />
                                </div>
                                <div style={{ paddingTop: 10, }}>
                                    <Button variant="contained" color="secondary" onClick={this.addBranch} >
                                        Create Branch
                            </Button>
                                    <Button variant="contained" color="default" onClick={((event) => {
                                        this.setState({ dialogMode: DialogMode.CreateCommit, value: null })
                                    })}>
                                        Cancel
                            </Button>
                                </div>
                            </div>
                        )}
                </form>
            </Grid>
            <Grid container xs={7}>
                <Grid item xs={7}>
                    {this.state.selectedBranchName? (
                        <Alert severity="success" onClose={(event) => this.setState({selectedBranchName : null})}>Merging branch <strong>{this.state.selectedBranchName}</strong>. Select branch to merge it in.</Alert>
                    ) : (
                        <Alert severity="info">To Merge, please click on a branch.</Alert>
                    )}
                </Grid>
                <Grid item xs={12} style={{padding: 20, minHeight: 200}}>
                    <Gitgraph options={{
                        template : gitGraphTemplate,
                        mode: Mode.Compact,
                    }}>
                        {(gitgraph) => {
                            const masterBranch = gitgraph.branch("master");
                            masterBranch.commit({
                                subject: "Initial Commit",
                                onClick: this.handleCommitClick,
                            });
                            this.setState({ gitgraph, branches: [masterBranch], branchName: "master" });
                        }
                        }
                    </Gitgraph>
                </Grid>
                </Grid></>
        );
    }
}