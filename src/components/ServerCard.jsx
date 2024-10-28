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
import { useState } from "react";

const ServerCard = ({ stats, gridIdx }) => {
  const [detail, setDetail] = useState(false);

  const toggleDetail = () => {
    setDetail(!detail);
  };

  const getMemPercentage = () => {
    // TODO: Don't forget to parse the values (both values might not always be in GiB)
    const used = parseFloat(stats.memory_usage.used);
    const free = parseFloat(stats.memory_usage.free);
    return Math.round((free / (free + used)) * 100, 1);
  };

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      key={gridIdx}
      sx={{
        transition: "all 300ms ease",
      }}
    >
      <Card
        sx={{
          maxWidth: "500px",
          border: "1px solid #ddd",
          padding: "16px",
          borderRadius: "8px",
          transition: "all 300ms ease",
          "&:hover": {
            backgroundColor: "lightgray",
          },
        }}
        onClick={toggleDetail}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {stats.hostname}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Uptime: {stats.uptime}
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
                value={parseFloat(stats.cpu_usage)}
                startAngle={-90}
                endAngle={90}
                color="primary"
                text={({ value }) => `${value}%`}
              />
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1" align="center">
                Mem. Usage
              </Typography>
              <Gauge
                width={100}
                height={100}
                value={getMemPercentage()}
                startAngle={-90}
                endAngle={90}
                color="secondary"
                text={({ value }) => `${value}%`}
              />
            </Grid>
            <Grid item xs={4}>
              {stats.gpu_usage.length > 0 && (
                <>
                  <Typography variant="subtitle1" align="center">
                    GPU Usage
                  </Typography>
                  <Gauge
                    width={100}
                    height={100}
                    value={parseFloat(stats.gpu_usage[0].utilization)}
                    startAngle={-90}
                    endAngle={90}
                    color="success"
                    text={({ value }) => `${value}%`}
                  />
                </>
              )}
            </Grid>
            {detail && (
              <>
                <Grid item xs={12} sx={{ width: "90%" }}>
                  <Card
                    variant="outlined"
                    style={{ marginTop: "16px", background: "transparent" }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1">
                        User sessions ({stats.logged_in_users.length})
                      </Typography>
                      <List>
                        {stats.logged_in_users.map((user, userIndex) => (
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
                <Grid item xs={12} sx={{ width: "90%" }}>
                  <Card
                    variant="outlined"
                    style={{ marginTop: "16px", background: "transparent" }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1">Disk Usage</Typography>
                      <Table size="small">
                        <TableBody>
                          {Object.entries(stats.disk_usage).map(
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
                <Grid item xs={12} sx={{ width: "90%" }}>
                  <Card
                    variant="outlined"
                    style={{ marginTop: "16px", background: "transparent" }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1">Network Usage</Typography>
                      {Object.entries(stats.network_usage).map(
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
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ServerCard;
