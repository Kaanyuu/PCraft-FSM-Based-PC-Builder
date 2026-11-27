import { Header } from "@/Header.tsx"
import { CategoryNav } from "./CategoryNav"
import { useState } from "react";
import { type Category } from "./types/types";

function App() {
  const [active, setActive] = useState<Category>("cpu");
  return (
    <>
      <Header selectedCount={0} onClearBuild={() => {}} />
      <CategoryNav
      //Placeholders only
        active={active}
        filled={0 as unknown as Record<Category, boolean>}
        onSelect={setActive}
      />
    </>
  );
}

export default App
