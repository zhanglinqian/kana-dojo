import PostWrapper from '@/shared/components/PostWrapper';
import ContentLayout from '@/shared/components/ContentLayout';
import ContributorsGrid from '@/features/Legal/credits/ContributorsGrid';
import SponsorsGrid from '@/features/Legal/credits/SponsorsGrid';
import { KO_FI_SUPPORTERS } from '@/features/Legal/credits/sponsorsData';
import type { Contributor } from './types';
import { Handshake, Heart } from 'lucide-react';

type GHContributor = {
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
};

const fetchContributors = async (): Promise<Contributor[]> => {
  try {
    const res = await fetch(
      'https://api.github.com/repos/lingdojo/kana-dojo/contributors?per_page=100',
      { next: { revalidate: 60 * 60 * 24 } }
    );

    if (!res.ok) return [];

    const data: GHContributor[] = await res.json();
    return data
      .filter((c) => c.type !== 'Bot')
      .map((c) => ({
        login: c.login,
        avatar: c.avatar_url,
        url: c.html_url,
      }));
  } catch (e) {
    console.error('Failed to fetch contributors', e);
    return [];
  }
};

export default async function Credits() {
  const contributors = await fetchContributors();
  const maintainers = contributors.slice(0, 2);
  const contributorsList = contributors.slice(2);

  const credits = `# Credits

  Thank you to everyone who has contributed to **KanaDojo** — maintainers, contributors, translators, and supporters.

  KanaDojo is what you see today thanks to everyone's work and suggestions. We'll keep making it **better**, and we hope you stay with us on this amazing adventure!
  `;

  return (
    <ContentLayout>
      <PostWrapper textContent={credits} />

      {maintainers.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mt-4 pb-2">Maintainers</h2>
          <ContributorsGrid contributors={maintainers} />
        </section>
      )}

      {contributorsList.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mt-4 pb-2">Contributors</h2>
          <ContributorsGrid contributors={contributorsList} />

          <div className="mt-8 p-6 bg-[var(--card-color)] border border-[var(--border-color)] rounded-lg">
            <p className="flex items-center gap-2 text-[var(--main-color)] font-medium mb-2">
              <Handshake className="text-[var(--main-color)]" />
              Want to contribute?
            </p>
            <p className="text-[var(--secondary-color)] text-sm">
              Visit our{' '}
              <a
                className="text-[var(--main-color)] underline font-semibold hover:opacity-70 transition-opacity"
                href="https://github.com/lingdojo/kana-dojo"
                target="_blank"
                rel="noreferrer"
              >
                GitHub repository
              </a>{' '}
              to get started. All contributions are welcome!
            </p>
          </div>
        </section>
      )}

      {KO_FI_SUPPORTERS.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mt-4 pb-2">Supporters</h2>
          <p className="my-1 leading-relaxed text-[var(--secondary-color)]">
            A special thanks to our supporters!
          </p>
          <SponsorsGrid sponsors={KO_FI_SUPPORTERS} />
          <div className="mt-8 p-6 bg-[var(--card-color)] border border-[var(--border-color)] rounded-lg">
            <p className="flex items-center gap-2 text-[var(--main-color)] font-medium mb-3">
              <Heart className="motion-safe:animate-pulse text-red-500 fill-current hover:text-red-500" />
              Support KanaDojo
            </p>
            <p className="text-[var(--secondary-color)] text-sm mb-4">
              Your support is really appreciated. Thank you!
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="inline-flex items-center px-4 py-2 bg-[var(--main-color)] text-[var(--background-color)] rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                href="https://ko-fi.com/kanadojo"
                target="_blank"
                rel="noreferrer"
              >
                Ko-fi
              </a>
              <a
                className="inline-flex items-center px-4 py-2 border-2 border-[var(--main-color)] text-[var(--main-color)] rounded-lg font-medium text-sm hover:bg-[var(--card-color)] transition-colors"
                href="https://www.patreon.com/cw/kanadojo"
                target="_blank"
                rel="noreferrer"
              >
                Patreon
              </a>
            </div>
          </div>
        </section>
      )}
    </ContentLayout>
  );
}
