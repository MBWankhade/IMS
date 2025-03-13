import { useRef, useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { FaCode, FaPlay } from "react-icons/fa";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "../utils/constants";
import { executeCode } from "./api";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue.400";

const CodeEditor = () => {
  const editorRef = useRef();
  const toast = useToast();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box bg="gray.900" p={6} borderRadius="lg" boxShadow="xl" maxW="1200px" mx="auto">
      <Tabs variant="soft-rounded" colorScheme="blue" isFitted>
        <TabList mb={4} borderRadius="md" bg="gray.800" p={2}>
          <Tab bg="gray.800" color="white">
            <Flex align="center" gap={2}>
              <Icon as={FaCode} /> Code Editor
            </Flex>
          </Tab>
          <Tab bg="gray.800" color="white">
            <Flex align="center" gap={2}>
              <Icon as={FaPlay} /> Output
            </Flex>
          </Tab>
        </TabList>
        <TabPanels>
          {/* Code Editor Panel */}
          <TabPanel>
            <Flex justify="space-between" align="center" mb={4}>
              <Box ml={2} mb={4} minWidth="150px">
                <Text mb={2} fontSize="lg">Language:</Text>
                <Menu isLazy>
                  <MenuButton as={Button} bg="gray.800" color="white" zIndex="10">
                    {language}
                  </MenuButton>
                  <MenuList bg="gray.800" color="white" zIndex="10">
                    {languages.map(([lang, version]) => (
                      <MenuItem
                        key={lang}
                        color={lang === language ? ACTIVE_COLOR : "white"}
                        bg={lang === language ? "gray.800" : "transparent"}
                        _hover={{ color: ACTIVE_COLOR, bg: "gray.900" }}
                        onClick={() => onSelect(lang)}
                      >
                        {lang} <Text as="span" color="gray.400" fontSize="sm">({version})</Text>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Box>
              <Button bg="gray.800" color="white" zIndex="10" size="sm" isLoading={isLoading} onClick={runCode}>Run Code</Button>
            </Flex>
            <Editor
              options={{ minimap: { enabled: false } }}
              height="75vh"
              theme="vs-dark"
              language={language}
              defaultValue={CODE_SNIPPETS[language]}
              onMount={onMount}
              value={value}
              onChange={(value) => setValue(value)}
            />
          </TabPanel>

          {/* Output Panel with Mac Terminal Styling */}
          <TabPanel>
            <Box w="100%" maxW="800px" mx="auto">
              <Text mb={2} fontSize="lg">Output</Text>
              <Box
                bg="black"
                color="white"
                borderRadius="md"
                border="1px solid #333"
                fontFamily="monospace"
                overflow="hidden"
              >
                {/* Mac Terminal Header */}
                <Flex bg="gray.800" px={4} py={2} align="center">
                  <Box w={3} h={3} bg="red.500" borderRadius="full" mr={2} />
                  <Box w={3} h={3} bg="yellow.500" borderRadius="full" mr={2} />
                  <Box w={3} h={3} bg="green.500" borderRadius="full" />
                </Flex>

                {/* Output Content */}
                <Box height="70vh" p={4} overflowY="auto" whiteSpace="pre-wrap">
                  {output
                    ? output.map((line, i) => (
                        <Text key={i} color={isError ? "red.400" : "white"}>
                          {line}
                        </Text>
                      ))
                    : 'Click "Run Code" to see the output here'}
                </Box>
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CodeEditor;