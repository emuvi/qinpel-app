import os


def makeBackgroundsBlur():
    os.chdir('tmp')
    items = os.listdir()
    for item in items:
        os.system(f'magick {item} -blur 1x1 {item}')
        print("Done: " + item)


if __name__ == '__main__':
    makeBackgroundsBlur()
    print("Finished!")
