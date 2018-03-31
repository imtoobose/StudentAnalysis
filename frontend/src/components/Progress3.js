import React, { Component } from "react";
import {
  Grid,
  Card,
  Avatar,
  CardContent,
  Typography,
  LinearProgress,
  Divider
} from "material-ui";
import BookIcon from "material-ui-icons/Book";
import { withStyles } from "material-ui/styles";


const niceColor = "#898C92";
const styles = theme => ({
  icon: { fontSize: "2.2rem", color: niceColor },
  text: { fontSize: "0.9rem", color: niceColor },
  bigNumber: {
    textAlign: "right",
    fontSize: "1.2rem",
    color: theme.palette.primary.main,
    // textOoverflow: "ellipsis",

    /* Required for text-overflow to do anything */
    whiteSpace: "wrap",
    // overflow: "hidden"
  }
});


class Progress3 extends Component {
  render() {
    const { classes, theme, data } = this.props;
    if (!data) return null;

    return <Card style={this.props.style}>
        <CardContent>
          <Grid container>
            <Grid item xs={6}>
              <Typography className={classes.text}>
                {data["name"].toUpperCase().length > 20 ? data["name"]
                      .toUpperCase()
                      .substring(
                        0,
                        20 - 3
                      ) + "..." : data["name"].toUpperCase() }
              </Typography>
            </Grid>

            <Grid item xs={6} style={{ textAlign: "right", height: "75px" }}>
              <Typography title={data["name"].toUpperCase()} className={classes.bigNumber}>
                {Math.floor(parseFloat(data["value"]*10))}%
              </Typography>
            </Grid>
          </Grid>
          <LinearProgress variant="determinate" value={data["value"]*10} style={{ marginTop: 10 }} />
        </CardContent>
      </Card>;
  }
}

export default withStyles(styles, { withTheme: true })(Progress3);