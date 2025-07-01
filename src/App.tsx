import "./App.css";
import HomeDashboard from "./components/dash";
import { ThemeProvider } from "./providers/themeprovider";
import { TickProvider } from "./providers/tickprovider";

function App() {
  return (
    <TickProvider>
      <ThemeProvider>
        <HomeDashboard />
      </ThemeProvider>
    </TickProvider>
  );
}

export default App;
