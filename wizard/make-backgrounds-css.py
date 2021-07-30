def makeBackgroundsCSS(ofName):
    result = "\n"
    result += ".QinpelBackground-" + ofName + " {\n"
    result += "  background-image: url('./assets/" + ofName + ".png');\n"
    result += "}\n"
    for i in range(30):
        result += "\n"
        result += ".QinpelBackground-" + ofName + "-" + str(i) + " {\n"
        result += "  background-image: url('./assets/" + \
            ofName + "-" + str(i) + ".png');\n"
        result += "}\n"
    return result


if __name__ == '__main__':
    cssBackgrounds = ""
    cssBackgrounds += makeBackgroundsCSS("light")
    cssBackgrounds += makeBackgroundsCSS("normal")
    cssBackgrounds += makeBackgroundsCSS("dark")
    with open("../source/qinpel.css", "a") as cssFile:
        cssFile.write(cssBackgrounds)
    print("Finished!")
