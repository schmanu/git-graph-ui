import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            color: theme.palette.text.secondary,
        },
        title: {
            flexGrow: 1,
          },
        small: {
            color: '#000',
            padding: 8,
            childSize: 24,
        }
    }),
);