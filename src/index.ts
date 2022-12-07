/**
 * Based on three papers
 * https://dl.acm.org/doi/pdf/10.1145/1526709.1526758
 * https://purehost.bath.ac.uk/ws/portalfiles/portal/129234496/4_Byde_Wan_Cayzer.pdf
 * https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=4383156
 */

interface TagProvider {
	count(tag: string): number;
	countIntersection(a: string, b: string): number;
	countUnion(a: string, b: string): number;
}

class TagMath {
	constructor(private readonly provider: TagProvider) {}

	/**
	 * Compute the asymmetric relevance of two tags.
	 * @param a
	 * @param b
	 */
	asymmetricRelevance(a: string, b: string) {
		return this.provider.countIntersection(a, b) / this.provider.count(a);
	}

	/**
	 * Compute the symmetric relevance of two tags.
	 * @param a
	 * @param b
	 */
	symmetricRelevance(a: string, b: string) {
		return (
			this.provider.countIntersection(a, b) / this.provider.countUnion(a, b)
		);
	}

	similarity(a: string[], b: string[]) {
		const intersection = a.filter(b.includes);
	}
}
