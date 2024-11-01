import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ServerCard from "./ServerCard.jsx";
import { server_stats } from "../placeholders/server_stats.js";
import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState(server_stats);
  const getStats = async () => {
    try {
      const response = await axios.get("https://api.fit-vut.cz/get-stats", {
        withCredentials: true,
        headers: { "Access-Control-Allow-Origin": "*" },
      });

      if (response.status === 200) {
        setData(response);
        return true;
      }
      return false;
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message,
      );
      return false;
    }
  };
  useEffect(getStats(), []);

  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Server Statistics Dashboard
      </Typography>
      <Grid container spacing={4}>
        {data.map((serverStats, index) => {
          return <ServerCard stats={serverStats} gridIdx={index} key={index} />;
        })}
      </Grid>
    </Container>
  );
}

export default Dashboard;
