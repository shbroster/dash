import "./App.css";
import HomeDashboard from "./components/dash";
import { ThemeProvider } from "./providers/themeprovider";
import { TickProvider } from "./providers/tickprovider";

function App() {
  return (
    <ThemeProvider>
      <TickProvider>
      <HomeDashboard />
      </TickProvider>
    </ThemeProvider>
  );
}

export default App;
