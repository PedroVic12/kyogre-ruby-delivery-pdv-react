import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import {
  Box,
  Checkbox,
  Tabs,
  Tab,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCheckbox = styled(Checkbox)({
  transform: "scale(1.5)",
});

const MarkdownChecklist = () => {
  const [markdownContent, setMarkdownContent] = useState("");
  const [checklist, setChecklist] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  // Atualizar a checklist quando o markdown é carregado
  useEffect(() => {
    const parseChecklist = () => {
      const lines = markdownContent.split("\n");
      const parsedChecklist = {};
      let currentTab = "General";

      lines.forEach((line) => {
        if (line.startsWith("####")) {
          currentTab = line.replace("####", "").trim();
          parsedChecklist[currentTab] = [];
        } else if (line.trim().startsWith("[")) {
          const isChecked = line.trim().startsWith("[x]");
          const content = line.replace(/^\[.\]\s*/, "");
          parsedChecklist[currentTab] = parsedChecklist[currentTab] || [];
          parsedChecklist[currentTab].push({ checked: isChecked, text: content });
        }
      });
      setChecklist(parsedChecklist);
    };

    if (markdownContent) parseChecklist();
  }, [markdownContent]);

  // Manipular mudanças no estado da checklist
  const handleCheckboxChange = (tab, index) => {
    const updatedChecklist = {
      ...checklist,
      [tab]: checklist[tab].map((item, idx) =>
        idx === index ? { ...item, checked: !item.checked } : item
      ),
    };
    setChecklist(updatedChecklist);
  };

  // Salvar checklist como Markdown
  const saveChecklist = () => {
    let updatedMarkdown = "";
    Object.keys(checklist).forEach((tab) => {
      updatedMarkdown += `#### ${tab}\n`;
      checklist[tab].forEach((item) => {
        updatedMarkdown += `${item.checked ? "[x]" : "[]"} ${item.text}\n`;
      });
      updatedMarkdown += "\n";
    });

    const blob = new Blob([updatedMarkdown], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "updated_checklist.md";
    link.click();
  };

  // Carregar o arquivo Markdown
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file.name.endsWith(".md")) {
      alert("Por favor, selecione um arquivo Markdown (.md).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setMarkdownContent(e.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Markdown Checklist Generator
      </Typography>

      <Button
        variant="contained"
        component="label"
        sx={{ marginBottom: "20px" }}
      >
        Carregar Arquivo Markdown
        <input
          type="file"
          accept=".md"
          onChange={handleFileUpload}
          hidden
        />
      </Button>

      {Object.keys(checklist).length > 0 && (
        <>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ marginBottom: "20px" }}
          >
            {Object.keys(checklist).map((tab, index) => (
              <Tab key={index} label={tab} />
            ))}
          </Tabs>

          {Object.keys(checklist).map((tab, index) => (
            <Box
              key={index}
              sx={{ display: activeTab === index ? "block" : "none" }}
            >
              <Typography variant="h5" gutterBottom>
                {tab}
              </Typography>
              <Box>
                {checklist[tab].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <StyledCheckbox
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(tab, idx)}
                    />
                    <Typography>{item.text}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}

          <Button
            variant="contained"
            color="primary"
            onClick={saveChecklist}
            sx={{ marginTop: "20px" }}
          >
            Salvar Checklist
          </Button>
        </>
      )}

      {!markdownContent && (
        <Typography color="textSecondary" sx={{ fontStyle: "italic" }}>
          Carregue um arquivo Markdown para começar.
        </Typography>
      )}
    </Box>
  );
};

export default MarkdownChecklist;
