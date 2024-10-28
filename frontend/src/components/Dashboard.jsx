import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ServerCard from "./ServerCard.jsx";
import { server_stats } from "../placeholders/server_stats.js";

function Dashboard() {
  const data = server_stats;
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
