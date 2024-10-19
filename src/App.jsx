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
import { server_stats } from "./placeholders/server_stats.js";

function App() {
  const data = server_stats;

  return (
    <Container style={{ marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Server Statistics Dashboard
      </Typography>
      <Grid container spacing={4}>
        {data.map((server, index) => {
          // Calculate memory usage percentage
          const memoryUsed = parseFloat(server.memory_usage.used);
          const memoryFree = parseFloat(server.memory_usage.free);
          const totalMemory = memoryUsed + memoryFree;
          const memoryUsagePercentage = Math.round(
            (memoryUsed / totalMemory) * 100,
            1,
          );

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                style={{
                  border: "1px solid #ddd",
                  padding: "16px",
                  borderRadius: "8px",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {server.hostname}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Uptime: {server.uptime}
                  </Typography>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" align="center">
                        CPU Usage
                      </Typography>
                      <Gauge
                        width={100}
                        height={100}
                        value={parseFloat(server.cpu_usage)}
                        startAngle={-90}
                        endAngle={90}
                        color="primary"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="subtitle1" align="center">
                        Memory Usage
                      </Typography>
                      <Gauge
                        width={100}
                        height={100}
                        value={memoryUsagePercentage}
                        startAngle={-90}
                        endAngle={90}
                        color="secondary"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      {server.gpu_usage.length > 0 && (
                        <>
                          <Typography variant="subtitle1" align="center">
                            GPU Usage
                          </Typography>
                          <Gauge
                            width={100}
                            height={100}
                            value={parseFloat(server.gpu_usage[0].utilization)}
                            startAngle={-90}
                            endAngle={90}
                            color="success"
                          />
                        </>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Card variant="outlined" style={{ marginTop: "16px" }}>
                        <CardContent>
                          <Typography variant="subtitle1">
                            Disk Usage
                          </Typography>
                          <Table size="small">
                            <TableBody>
                              {Object.entries(server.disk_usage).map(
                                ([disk, usage]) => (
                                  <TableRow key={disk}>
                                    <TableCell>{disk}</TableCell>
                                    <TableCell>{usage}</TableCell>
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card variant="outlined" style={{ marginTop: "16px" }}>
                        <CardContent>
                          <Typography variant="subtitle1">
                            Network Usage
                          </Typography>
                          {Object.entries(server.network_usage).map(
                            ([iface, stats]) => (
                              <Typography variant="body2" key={iface}>
                                {iface}: RX {stats.rx_bytes} bytes, TX{" "}
                                {stats.tx_bytes} bytes
                              </Typography>
                            ),
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12}>
                      <Card variant="outlined" style={{ marginTop: "16px" }}>
                        <CardContent>
                          <Typography variant="subtitle1">
                            User sessions ({server.logged_in_users.length})
                          </Typography>
                          <List>
                            {server.logged_in_users.map((user, userIndex) => (
                              <ListItem key={userIndex}>
                                <ListItemText
                                  primary={`${user.user} (${user.tty})`}
                                  secondary={`Host: ${user.host}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default App;
