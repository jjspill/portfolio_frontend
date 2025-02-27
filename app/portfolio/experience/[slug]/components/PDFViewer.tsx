import React from 'react';
import ClickableDiv from './ClickableDivComponent';
import { ExperienceProps } from '../../experienceHelpers';
import { getAPIUrl } from '../../../../../config/config';

interface PDFViewerProps {
  experienceTitle: string;
}

async function getExperiencePDFs(
  slug: string,
): Promise<{ title: string; path: string }[]> {
  const apiURL = getAPIUrl();
  const res = await fetch(`${apiURL}/experiences/${slug}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
    },
    next: { revalidate: 0 },
  });

  const experienceData = await res.json();

  if (!experienceData?.data) {
    console.error('Unable to fetch data from the APIII.');
  }

  return experienceData?.data.documents;
}

export async function PDFViewer({ experienceTitle }: PDFViewerProps) {
  const pdfFiles = await getExperiencePDFs(experienceTitle);
  return (
    <div className="overflow-hidden p-4 pb-8">
      <div className="flex overflow-x-auto">
        <div className="flex flex-row space-x-4 min-w-full items-start justify-start">
          {pdfFiles.map(
            (file, index) => (
              (file.title = file.title.replace(/\.pdf$/, '')),
              (
                <ClickableDiv key={index} path={file.path}>
                  <div
                    className="h-fit bg-gray-200 p-2 rounded-xl group relative"
                    style={{ width: '250px' }}
                  >
                    <iframe
                      title={file.title}
                      src={`${file.path}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-[234px] h-[301px]"
                    />
                    <div className="flex flex-row items-center justify-center mt-2">
                      <h3 className="text-center text-lg text-gray-800">
                        {file.title}
                      </h3>
                    </div>
                    <svg
                      data-slot="icon"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="absolute md:hidden group-hover:block"
                      style={{
                        width: '1em',
                        height: '1em',
                        bottom: '0.5em',
                        right: '0.5em',
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </div>
                </ClickableDiv>
              )
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
