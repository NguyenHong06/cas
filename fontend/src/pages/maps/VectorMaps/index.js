import React from "react";
import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";

import {
  Grid,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Typography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

import Africa from "./Africa";
import Asia from "./Asia";
import China from "./China";
import Europe from "./Europe";
import NorthAmerica from "./NorthAmerica";
import Oceania from "./Oceania";
import SouthAmerica from "./SouthAmerica";
import USA from "./USA";
import World from "./World";

import "../../../vendor/jvectormap.css";

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

function VectorMaps() {
  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom display="inline">
        Vector Maps
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
        </Link>
        <Link component={NavLink} exact to="/dashboard">
          Maps
        </Link>
        <Typography>Vector Maps</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <World />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Africa />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Asia />
        </Grid>
        <Grid item xs={12} lg={6}>
          <China />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Europe />
        </Grid>
        <Grid item xs={12} lg={6}>
          <NorthAmerica />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Oceania />
        </Grid>
        <Grid item xs={12} lg={6}>
          <SouthAmerica />
        </Grid>
        <Grid item xs={12} lg={6}>
          <USA />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default VectorMaps;
