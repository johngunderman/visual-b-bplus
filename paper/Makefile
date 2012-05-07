DOC = paper

%.pdf : %.dot
	dot -Tpdf $*.dot -o $*.pdf

build:
	pdflatex $(DOC) > /dev/null
	pdflatex $(DOC) > /dev/null

debug:
	pdflatex $(DOC)
	pdflatex $(DOC)

kde: build
	kpdf $(DOC).pdf

kde4: build
	okular $(DOC).pdf

mac: build
	open $(DOC).pdf

all: build

clean:
	-rm -f *.aux *.bbl *.blg *.log *.pdf
	-cd figs; $(MAKE) clean