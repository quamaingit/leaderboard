import React, { useState, useEffect } from "react";
import { fetchData } from "./apiUtils";
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";
import styles from "./Leaderboard.module.css";

interface LeaderboardEntry {
  displayName: string;
  hitFactor: number;
  rank: string;
  timeInSeconds: number;
}

const apiBaseUrl = process.env.REACT_APP_API_URL || "";

const Leaderboard: React.FC = () => {
  const [stageId, setStageId] = useState<string>("");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [visibleLeaderboardData, setVisibleLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const showToast = (message: string, severity: "success" | "error") => {
    setToastNotification({ message, severity });
  };

  const importLeaderboardData = async () => {
    if (!stageId.trim()) {
      showToast("Please enter a valid Stage ID.", "error");
      return;
    }

    setLoading(true);
    try {
      await fetchData(`${apiBaseUrl}/fetchLeaderboard?stageId=${stageId.trim()}`);
      showToast("Leaderboard data imported successfully!", "success");
    } catch {
      showToast("Failed to import leaderboard data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboardData = async () => {
    if (!stageId.trim()) {
      showToast("Please enter a valid Stage ID.", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchData(`${apiBaseUrl}/getLeaderboard?stageId=${stageId.trim()}`);
      setLeaderboardData(data);
      setVisibleLeaderboardData(data);
      showToast("Leaderboard data fetched successfully!", "success");
    } catch {
      showToast("Failed to fetch leaderboard data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = leaderboardData.filter((entry) =>
      entry.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setVisibleLeaderboardData(filtered);
    setPage(0);
  }, [searchQuery, leaderboardData]);

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Leaderboard Management
      </Typography>

      {/* Stage ID Input */}
      <Paper style={{ padding: 16, marginBottom: 16 }}>
        <TextField
          label="Stage ID"
          variant="outlined"
          fullWidth
          value={stageId}
          onChange={(e) => setStageId(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={importLeaderboardData}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : "Import Leaderboard"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={fetchLeaderboardData}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : "View Leaderboard"}
          </Button>
        </div>
      </Paper>

      {/* Table Section */}
      <Paper>
        {/* Filter Section */}
        <div className={styles.searchContainer}>
          <TextField
            label="Search by Display Name"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setSearchQuery("")}
          >
            Clear Filter
          </Button>
        </div>

        {/* Table */}
        <Table>
          {/* Table Header */}
          <TableHead>
            <TableRow className={styles.tableHeader}>
              <TableCell>Display Name</TableCell>
              <TableCell>Hit Factor</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Time (s)</TableCell>
            </TableRow>
          </TableHead>
          {/* Table Body */}
          <TableBody>
            {visibleLeaderboardData.length > 0 ? (
              visibleLeaderboardData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>{entry.displayName}</TableCell>
                    <TableCell>{entry.hitFactor}</TableCell>
                    <TableCell>{entry.rank}</TableCell>
                    <TableCell>{entry.timeInSeconds}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className={styles.noDataRow} align="center">
                  No data to show
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Table Pagination */}
        <TablePagination
          component="div"
          count={visibleLeaderboardData.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Paper>

      {/* Notifications */}
      {toastNotification && (
        <Snackbar
          open={!!toastNotification}
          autoHideDuration={3000}
          onClose={() => setToastNotification(null)}
        >
          <Alert
            onClose={() => setToastNotification(null)}
            severity={toastNotification.severity}
            variant="filled"
          >
            {toastNotification.message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Leaderboard;
