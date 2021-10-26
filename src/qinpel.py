def cleanLine(line: str) -> str:
    result = line.strip()
    while result.find("  ") > -1:
        result = result.replace("  ", " ")
    return result


def getQinpelLines() -> list[str]:
    reader = open('src/qinpel.ts', 'r')
    result = reader.readlines()
    reader.close()
    return result


def putQinpelLines(lines: list[str]):
    writer = open('src/qinpel.ts', 'w')
    writer.writelines(lines)
    writer.close()


def getIdentifier(onLine: str, ofStarter: str) -> str:
    if onLine.startswith(ofStarter): 
        end = onLine.index(" ", len(ofStarter) +1)
        return onLine[len(ofStarter) : end]
    return ""


def getUtilsExports() -> list[str]:
    result = []
    reader = open('src/utils.ts', 'r')
    for line in reader:
        line = cleanLine(line)
        identifier = getIdentifier(line, "export class ")
        if identifier:
            result.append(identifier)
        identifier = getIdentifier(line, "export enum ")
        if identifier:
            result.append(identifier)
        identifier = getIdentifier(line, "export type ")
        if identifier:
            result.append(identifier)
    reader.close()
    return result


def putExportsFromUtils():
    lines = getQinpelLines()
    begin = -1
    end = -1
    index = -1
    for line in lines:
        index += 1
        line = cleanLine(line)
        if line == "export {":
            begin = index
        elif line == "} from \"./utils\";":
            end = index
            break
    if begin == -1 or end == -1:
        raise "Could not found the utils delimiters on qinpel.ts"
    index = end -1
    while index > begin:
        lines.pop(index)
        index -= 1
    exports = getUtilsExports()
    index = begin+1
    for export in exports:
        lines.insert(index, "    " + export + ",\n")
        index += 1
    putQinpelLines(lines)

if __name__ == "__main__":
    putExportsFromUtils()
    print("Finish to generate the source code for src/qinpel.ts")