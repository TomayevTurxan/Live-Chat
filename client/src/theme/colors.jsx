export const brand = {
  50: "rgba(235, 243, 255, 1)",
  100: "rgba(210, 229, 255, 1)",
  200: "rgba(168, 202, 255, 1)",
  300: "rgba(125, 176, 255, 1)",
  400: "rgba(82, 150, 255, 1)",
  500: "rgba(51, 129, 250, 1)",
  600: "rgba(35, 114, 240, 1)",
  700: "rgba(25, 93, 221, 1)",
  800: "rgba(19, 74, 180, 1)",
  900: "rgba(14, 56, 135, 1)",
  950: "rgba(10, 41, 99, 1)",
};
const withAlphas = (color) => {
  const mainColor = color.main;
  let r, g, b;

  if (mainColor.startsWith("rgba")) {
    const parts = mainColor.match(
      /rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*\.?\d+)\)/
    );
    r = parseInt(parts[1], 10);
    g = parseInt(parts[2], 10);
    b = parseInt(parts[3], 10);
  }

  return {
    ...color,
    alpha4: `rgba(${r}, ${g}, ${b}, 0.04)`,
    alpha8: `rgba(${r}, ${g}, ${b}, 0.08)`,
    alpha12: `rgba(${r}, ${g}, ${b}, 0.12)`,
    alpha30: `rgba(${r}, ${g}, ${b}, 0.3)`,
    alpha50: `rgba(${r}, ${g}, ${b}, 0.5)`,
  };
};

export const neutral = {
  50: "rgba(248, 249, 250, 1)",
  100: "rgba(243, 244, 246, 1)",
  200: "rgba(229, 231, 235, 1)",
  300: "rgba(210, 214, 219, 1)",
  400: "rgba(157, 164, 174, 1)",
  500: "rgba(108, 115, 127, 1)",
  600: "rgba(77, 87, 97, 1)",
  700: "rgba(47, 55, 70, 1)",
  800: "rgba(28, 37, 54, 1)",
  850: "rgba(21, 30, 48, 1)",
  900: "rgba(17, 25, 39, 1)",
};

export const blue = withAlphas({
  lightest: "rgba(236, 253, 255, 1)",
  light: "rgba(207, 249, 254, 1)",
  main: "rgba(34, 184, 216, 1)",
  dark: "rgba(14, 112, 144, 1)",
  darkest: "rgba(22, 76, 99, 1)",
  contrastText: "rgba(255, 255, 255, 1)",
});

export const green = withAlphas({
  lightest: "rgb(3, 3, 3)",
  light: "rgba(134, 230, 181, 1)",
  main: "rgba(48, 216, 137, 1)",
  dark: "rgba(22, 179, 100, 1)",
  darkest: "rgb(120, 121, 120)",
  contrastText: "rgba(255, 255, 255, 1)",
});

export const indigo = withAlphas({
  lightest: "rgba(245, 247, 255, 1)",
  light: "rgba(235, 238, 254, 1)",
  main: "rgba(99, 102, 241, 1)",
  dark: "rgba(67, 56, 202, 1)",
  darkest: "rgba(49, 46, 129, 1)",
  contrastText: "rgba(255, 255, 255, 1)",
});

export const purple = withAlphas({
  lightest: "rgba(249, 245, 255, 1)",
  light: "rgba(244, 235, 255, 1)",
  main: "rgba(158, 119, 237, 1)",
  dark: "rgba(105, 65, 198, 1)",
  darkest: "rgba(66, 48, 125, 1)",
  contrastText: "rgba(255, 255, 255, 1)",
});

export const success = withAlphas({
  lightest: "rgba(240, 253, 249, 1)",
  light: "rgba(134, 230, 181, 1)",
  main: "rgba(48, 216, 137, 1)",
  dark: "rgba(22, 179, 100, 1)",
  darkest: "rgba(8, 76, 46, 1)",
  contrastText: "rgba(255, 255, 255, 1)",
});

export const info = withAlphas({
  lightest: "rgba(236, 253, 255, 1)",
  light: "rgba(207, 249, 254, 1)",
  main: "rgba(34, 184, 216, 1)",
  dark: "rgba(14, 112, 144, 1)",
  darkest: "rgba(22, 76, 99, 1)",
  contrastText: "rgba(255, 255, 255, 1)",
});

export const warning = withAlphas({
  lightest: "rgba(255, 250, 235, 1)",
  light: "rgba(254, 240, 199, 1)",
  main: "rgba(247, 144, 9, 1)",
  dark: "rgba(181, 71, 8, 1)",
  darkest: "rgba(122, 46, 14, 1)",
  contrastText: "rgba(255, 255, 255, 1)",
});

export const error = withAlphas({
  lightest: "rgba(254, 243, 242, 1)",
  light: "rgba(252, 165, 165, 1)",
  main: "rgba(240, 68, 56, 1)",
  dark: "rgba(185, 28, 28, 1)",
  darkest: "rgba(122, 39, 26, 1)",
  contrastText: "rgba(255, 255, 255, 1)",
});
