import os


def makeBackgroundsHue(ofName):
    for idx, val in enumerate(range(0, 204, 7)):
        print(f'Making {ofName} of hue {val}.')
        os.system(f'magick {ofName}.png -modulate 100,100,{val} {ofName}-{idx}.png')


if __name__ == '__main__':
    os.chdir('..');
    os.chdir('design');
    os.chdir('background');
    makeBackgroundsHue('light')
    makeBackgroundsHue('normal')
    makeBackgroundsHue('dark')
    print("Finished!")
