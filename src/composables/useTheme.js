import { onMounted, ref, watch } from "vue";

const STORAGE_KEY = "transcriptor.theme";

export function useTheme() {
  const theme = ref("dark");

  onMounted(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme.value = savedTheme || (systemPrefersDark ? "dark" : "light");
  });

  watch(
    theme,
    (value) => {
      document.documentElement.dataset.theme = value;
      localStorage.setItem(STORAGE_KEY, value);
    },
    { immediate: true }
  );

  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark";
  };

  return {
    theme,
    toggleTheme
  };
}
