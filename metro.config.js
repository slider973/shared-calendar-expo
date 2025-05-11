// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);

// Add CJS extension for Firebase compatibility
defaultConfig.resolver.sourceExts.push('cjs');

// This is the key line that fixes the "Component auth has not been registered yet" error
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
