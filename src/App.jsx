// App.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Gauge } from "@mui/x-charts";
import ServerCard from "./components/ServerCard.jsx";
import { server_stats } from "./placeholders/server_stats.js";

function App() {
  const data = server_stats;
  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Server Statistics Dashboard
      </Typography>
      <Grid container spacing={4}>
        {data.map((serverStats, index) => {
          // Calculate memory usage percentage
          return <ServerCard stats={serverStats} gridIdx={index} key={index} />;
        })}
      </Grid>
    </Container>
  );
}

export default App;
