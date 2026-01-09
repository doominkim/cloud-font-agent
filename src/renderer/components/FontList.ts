/**
 * FontList Component
 * 폰트 목록을 제공업체별로 그룹화하여 표시하는 컴포넌트
 * Requirements: 3.1, 2.2, 7.3
 */

import { Component } from "./base/Component";
import { Font, Provider } from "../../types/ui";
import { ProviderGroup } from "./ProviderGroup";
import { filterFonts } from "../utils/search";

export interface FontListProps {
  fonts: Font[];
  searchQuery: string;
  onFontToggle: (fontId: string, enabled: boolean) => void;
  onInfoClick: (fontId: string) => void;
}

/**
 * 제공업체별로 그룹화된 폰트 데이터 구조
 */
export interface GroupedFonts {
  provider: Provider;
  fonts: Font[];
}

export class FontList extends Component<FontListProps> {
  private providerGroups: ProviderGroup[] = [];
  private collapsedProviders: Set<string> = new Set();
  private container: HTMLElement | null = null;

  protected render(): HTMLElement {
    this.container = document.createElement("div");
    this.container.className = "font-list";

    // Apply search filtering (Requirement 2.2)
    const filteredFonts = filterFonts(this.props.fonts, this.props.searchQuery);

    // Group fonts by provider (Requirement 3.1)
    const groupedFonts = this.groupFontsByProvider(filteredFonts);

    // Render provider groups
    this.renderProviderGroups(groupedFonts);

    // Show empty state if no results
    if (groupedFonts.length === 0) {
      this.renderEmptyState();
    }

    return this.container;
  }

  /**
   * 폰트를 제공업체별로 그룹화
   * Requirement 3.1: Group fonts by provider
   *
   * @param fonts - 필터링된 폰트 배열
   * @returns 제공업체별로 그룹화된 폰트 데이터
   */
  private groupFontsByProvider(fonts: Font[]): GroupedFonts[] {
    // Create a map to group fonts by provider ID
    const providerMap = new Map<string, GroupedFonts>();

    fonts.forEach((font) => {
      if (!providerMap.has(font.providerId)) {
        // Create new provider group
        providerMap.set(font.providerId, {
          provider: {
            id: font.providerId,
            nameKo: font.providerNameKo,
            nameEn: font.providerNameEn,
          },
          fonts: [],
        });
      }

      // Add font to provider group
      providerMap.get(font.providerId)!.fonts.push(font);
    });

    // Convert map to array and sort by provider name
    return Array.from(providerMap.values()).sort((a, b) =>
      a.provider.nameKo.localeCompare(b.provider.nameKo, "ko")
    );
  }

  /**
   * 제공업체 그룹 렌더링
   * Requirement 3.1: Display fonts grouped by provider
   *
   * @param groupedFonts - 그룹화된 폰트 데이터
   */
  private renderProviderGroups(groupedFonts: GroupedFonts[]): void {
    // Clear existing groups
    this.destroyProviderGroups();

    groupedFonts.forEach((group) => {
      const providerGroup = new ProviderGroup({
        provider: group.provider,
        fonts: group.fonts,
        collapsed: this.collapsedProviders.has(group.provider.id),
        onToggleCollapse: () => {
          this.handleToggleCollapse(group.provider.id);
        },
        onFontToggle: this.props.onFontToggle,
        onInfoClick: this.props.onInfoClick,
      });

      this.providerGroups.push(providerGroup);
      this.container!.appendChild(providerGroup.getElement());
    });
  }

  /**
   * 빈 상태 렌더링 (검색 결과 없음)
   */
  private renderEmptyState(): void {
    const emptyState = document.createElement("div");
    emptyState.className = "font-list__empty";

    if (this.props.searchQuery.trim()) {
      emptyState.innerHTML = `
        <p>검색 결과가 없습니다.</p>
        <p class="font-list__empty-hint">"${this.escapeHtml(
          this.props.searchQuery
        )}"에 대한 폰트를 찾을 수 없습니다.</p>
      `;
    } else {
      emptyState.innerHTML = `
        <p>폰트가 없습니다.</p>
        <p class="font-list__empty-hint">구매한 폰트가 없습니다.</p>
      `;
    }

    this.container!.appendChild(emptyState);
  }

  /**
   * 제공업체 그룹 접기/펼치기 핸들러
   */
  private handleToggleCollapse(providerId: string): void {
    if (this.collapsedProviders.has(providerId)) {
      this.collapsedProviders.delete(providerId);
    } else {
      this.collapsedProviders.add(providerId);
    }
  }

  /**
   * 검색 쿼리 업데이트
   * Requirement 2.2: Filter fonts in real-time
   *
   * @param searchQuery - 새로운 검색 쿼리
   */
  public updateSearch(searchQuery: string): void {
    this.props.searchQuery = searchQuery;
    this.updateContent();
  }

  /**
   * 폰트 목록 업데이트
   *
   * @param fonts - 새로운 폰트 배열
   */
  public updateFonts(fonts: Font[]): void {
    this.props.fonts = fonts;
    this.updateContent();
  }

  /**
   * 컴포넌트 업데이트 (재렌더링)
   */
  private updateContent(): void {
    if (!this.container) return;

    // Clear container
    this.container.innerHTML = "";

    // Apply search filtering
    const filteredFonts = filterFonts(this.props.fonts, this.props.searchQuery);

    // Group fonts by provider
    const groupedFonts = this.groupFontsByProvider(filteredFonts);

    // Render provider groups
    this.renderProviderGroups(groupedFonts);

    // Show empty state if no results
    if (groupedFonts.length === 0) {
      this.renderEmptyState();
    }
  }

  /**
   * HTML 이스케이프 (XSS 방지)
   */
  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 제공업체 그룹 정리
   */
  private destroyProviderGroups(): void {
    this.providerGroups.forEach((group) => group.destroy());
    this.providerGroups = [];
  }

  /**
   * 컴포넌트 정리
   */
  public destroy(): void {
    this.destroyProviderGroups();
    super.destroy();
  }

  protected attachEventListeners(): void {
    // No direct event listeners needed
    // Events are handled by child components
  }
}
