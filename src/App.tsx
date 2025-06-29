import "./App.css";
import HomeDashboard from "./components/dash";
import { ThemeProvider } from "./components/themeprovider";

function App() {
  return (
    <ThemeProvider>
      <HomeDashboard />
    </ThemeProvider>
  );
}

export default App;
