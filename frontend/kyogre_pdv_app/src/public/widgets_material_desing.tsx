import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export function MUIButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return <Button variant="contained" color="primary" onClick={onClick}>{label}</Button>;
}

export function MUICard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card sx={{ padding: 2, border: "1px solid gray" }}>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        {children}
      </CardContent>
    </Card>
  );
}

export function MUITextField({ label, value, onChange }: { label: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      variant="outlined"
      sx={{ width: "100%" }}
    />
  );
}

